# CLI usage

**`@brother-ql/cli`** exposes **`runCli()`** for parity-style commands in **Node.js** — not for browser bundles. For **programmatic printing**, use **`@brother-ql/node`** (TCP/USB on Node) or **`@brother-ql/web`** (WebUSB / experimental TCP in the page); see [App integration](../guide/app-integration.md) and [Try in the browser](../guide/try-in-browser.md).

## Commands available today

- `print`
- `send`
- `discover`
- `info models`
- `info labels`
- `info env`

## Environment variables

The CLI reads global defaults from environment variables:

- `BROTHER_QL_BACKEND` (default: `network`)
- `BROTHER_QL_MODEL` (default: `QL-710W`)
- `BROTHER_QL_PRINTER` (default: `tcp://127.0.0.1:9100`)

## Programmatic example

```ts
import { runCli } from "../../packages/cli/src/index.js";

const result = runCli(["info", "env"], {
  env: {
    BROTHER_QL_BACKEND: "usb",
    BROTHER_QL_MODEL: "QL-820NWB",
    BROTHER_QL_PRINTER: "usb://0x04f9:0x209b"
  }
});

console.log(result.exitCode);
console.log(result.output);
```

## Current behavior caveat

The default CLI runtime currently returns scaffold strings for `print`, `send`, and `discover`. Treat this as a stable command shape with implementation details still evolving.
