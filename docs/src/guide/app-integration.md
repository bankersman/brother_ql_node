# App integration

This page covers **`@brother-ql/node`** — the Node.js printing client (`BrotherQlNodeClient`) over TCP or USB.

## Choosing a package

| Goal                                                    | Package                                                               |
| ------------------------------------------------------- | --------------------------------------------------------------------- |
| Node.js app, TCP or USB printing                        | **`@brother-ql/node`** (this page)                                    |
| Browser app, WebUSB or experimental in-page TCP         | **`@brother-ql/web`** — see [Try in the browser](./try-in-browser.md) |
| Scripts, `info models` / `info labels`, parity commands | **`@brother-ql/cli`** — see [CLI usage](../cli/overview.md)           |

## Prerequisites

- Node.js 24+
- `pnpm install` run at repo root
- Access to a Brother QL printer over TCP (`9100`) or USB

## Install from npm

Published packages live under the **`@brother-ql`** scope on npm. From the monorepo you can also depend on workspace packages after `pnpm build`.

## TCP quickstart

```ts
import { BrotherQlNodeClient } from "../../packages/node/src/index.js";

const client = new BrotherQlNodeClient({
  backend: "tcp",
  host: "192.168.1.50",
  port: 9100
});

const imageBytes = new Uint8Array([255, 255, 0, 0]);

const result = await client.print({
  model: "QL-710W",
  label: "62",
  imageBytes,
  timeoutMs: 1000
});

console.log(result);
```

Notes:

- If `host` is omitted, default is `127.0.0.1`.
- If `port` is omitted, default is `9100`.
- TCP path returns the blocking-send result, and `completed` can be `false` with `ambiguous: true` for network transports.

## USB quickstart

```ts
import { BrotherQlNodeClient } from "../../packages/node/src/index.js";

const client = new BrotherQlNodeClient({ backend: "usb" });

const imageBytes = new Uint8Array([255, 255, 0, 0]);

const result = await client.print({
  model: "QL-820NWB",
  label: "62",
  imageBytes
});

console.log(result);
```

Notes:

- USB discovery currently prefers vendor ID `0x04f9` and otherwise picks the first detected USB device.
- USB transfer methods are scaffolded right now, so treat USB flow as in-progress behavior while parity work continues.

## Choosing model and label

- Model IDs and label IDs are validated.
- Unknown model or label values throw immediately.
- Some labels are restricted to specific models.
- Two-color labels (like `62red`) require a model that supports two-color mode.

Programmatic helpers are available in core registry exports if you need discovery in your app logic.

## Image input expectations

`BrotherQlNodeClient.print()` currently takes `imageBytes: Uint8Array` and passes them to command generation.

- Geometry and raster conversion are applied in core.
- Threshold must be between `0` and `100` when provided.
- Invalid model-label combinations fail early.

## Next step

After this page, read [Troubleshooting](./troubleshooting.md). For CLI-style commands see [CLI usage](../cli/overview.md). For **browser** printing see [Try in the browser](./try-in-browser.md).
