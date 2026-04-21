# Try in the browser

This project ships a small **Vite demo** built with [`@brother-ql/web`](https://github.com/bankersman/brother-ql-node/tree/main/packages/web) — the high-level browser SDK on top of [`@brother-ql/core`](https://github.com/bankersman/brother-ql-node/tree/main/packages/core) and [`@brother-ql/transport-web`](https://github.com/bankersman/brother-ql-node/tree/main/packages/transport-web).

Install the SDK from npm: `pnpm add @brother-ql/web`. Full API and options are in the [**package README**](https://github.com/bankersman/brother-ql-node/blob/main/packages/web/README.md) (`BrotherQlWebClient`, `connect` / `print` / `dispose`). For Node.js printing, use **`@brother-ql/node`** ([App integration](../guide/app-integration.md)); for CLI commands in Node, use **`@brother-ql/cli`** ([CLI usage](../cli/overview.md)).

## WebUSB (recommended on the hosted site)

For the live app on GitHub Pages, **WebUSB** is the path that usually works:

- Use **Chrome** (or another browser with WebUSB).
- Connect the printer with a **USB cable**.
- The page must run in a **secure context** (HTTPS). The project’s Pages site satisfies that.

Open the demo, choose your device when prompted, then print from the **WebUSB** section.

## Direct Sockets TCP (optional — often broken)

Chrome’s **Direct Sockets** API (`TCPSocket`) can talk raw TCP to a printer on your LAN. In practice it is **experimental** and **bleeding edge**: many normal browser tabs — including a typical `github.io` page — will **not** expose `TCPSocket` (permissions, origin trials, Isolated Web Apps, managed policies, etc.).

The demo still includes **Connect TCP** / **Print (TCP)** so you can try. **Failures are expected** in restrictive environments; that does not necessarily mean the library is wrong.

## Open the live demo

**[Open live demo →](/web-demo/)**

After a local `pnpm docs:build`, the same bundle is available under `docs/.vitepress/dist/web-demo/` for offline checks.

## Monorepo commands

From the repository root:

```bash
pnpm --filter @brother-ql/web-demo dev
```

Build the demo alone:

```bash
pnpm --filter @brother-ql/web-demo build
```

Full documentation site (VitePress + embedded demo for `/web-demo/`):

```bash
pnpm docs:build
```
