# @brother-ql/web

**@brother-ql/web** is the **browser SDK** for printing to Brother QL hardware. It composes **`@brother-ql/core`** (command generation and blocking send) with **`@brother-ql/transport-web`** (WebUSB and experimental Chrome Direct Sockets TCP).

**When to use:** web apps bundled for **Chromium** (or other browsers that expose the needed APIs), with a **secure context** (HTTPS or `localhost`). For **Node.js** servers and desktop tools, use **`@brother-ql/node`**. For **CLI** commands and registry dumps in Node, use **`@brother-ql/cli`** — not this package.

## Documentation

- **Site:** [https://bankersman.github.io/brother-ql-node/](https://bankersman.github.io/brother-ql-node/)
- **Try in browser (WebUSB + demo):** [https://bankersman.github.io/brother-ql-node/guide/try-in-browser](https://bankersman.github.io/brother-ql-node/guide/try-in-browser)
- **App integration (Node-focused, useful context):** [https://bankersman.github.io/brother-ql-node/guide/app-integration](https://bankersman.github.io/brother-ql-node/guide/app-integration)

## Install

```bash
pnpm add @brother-ql/web
```

From the monorepo: clone, `pnpm install`, `pnpm build`.

## Usage

### WebUSB (recommended in the browser)

Use a **persistent** session: call **`connect()`** (after a user gesture) before **`print()`**, and **`dispose()`** when finished. The `"tcp"` backend name in this package refers to **Chrome Direct Sockets** `TCPSocket`, not Node’s `net.Socket`.

```typescript
import { BrotherQlWebClient } from "@brother-ql/web";

const client = new BrotherQlWebClient({ backend: "webusb" });
await client.connect();

const result = await client.print({
  model: "QL-820NWB",
  label: "62",
  imageBytes: rasterBytes,
  timeoutMs: 30_000
});

await client.dispose();
```

### Direct Sockets TCP (experimental)

Creates a transport per `print()`, similar to the Node TCP path. Often **unavailable** on normal HTTPS pages (permissions, IWA, origin trials). Treat as **bleeding edge** — failures in the wild are expected.

```typescript
import { BrotherQlWebClient } from "@brother-ql/web";

const client = new BrotherQlWebClient({
  backend: "tcp",
  host: "192.168.1.50",
  port: 9100
});

const result = await client.print({
  model: "QL-710W",
  label: "62",
  imageBytes: rasterBytes,
  timeoutMs: 15_000
});
```

## Related packages

- **`@brother-ql/core`** — protocol and model/label data
- **`@brother-ql/transport-web`** — low-level `RuntimeTransport` implementations; prefer **`@brother-ql/web`** for application code
- **`@brother-ql/node`** — TCP/USB printing on Node.js (`BrotherQlNodeClient`)
- **`@brother-ql/cli`** — `runCli()` parity commands for Node scripts (not for browser bundles)
