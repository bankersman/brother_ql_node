# brother-ql-node

[![CI](https://github.com/bankersman/brother-ql-node/actions/workflows/ci.yml/badge.svg)](https://github.com/bankersman/brother-ql-node/actions/workflows/ci.yml)
[![Pages](https://github.com/bankersman/brother-ql-node/actions/workflows/pages.yml/badge.svg)](https://bankersman.github.io/brother-ql-node/)
[![codecov](https://codecov.io/gh/bankersman/brother-ql-node/graph/badge.svg)](https://codecov.io/gh/bankersman/brother-ql-node)

TypeScript workspace for Brother QL printing from **Node.js** or **Chromium-based browsers**, with incremental parity against upstream [`brother_ql`](https://github.com/pklaus/brother_ql).

**Credits** — This project owes a great deal to **Philipp Klaus** and the [brother_ql](https://github.com/pklaus/brother_ql) Python library: protocol reverse engineering, model and label registries, and a de facto reference implementation the community has relied on for years. `brother-ql-node` is an independent TypeScript port and is not affiliated with Brother Industries.

## Documentation

- **Live site:** [https://bankersman.github.io/brother-ql-node/](https://bankersman.github.io/brother-ql-node/)
- VitePress source: `docs/` (pages under `docs/src/`)
- Local preview: `pnpm docs:dev`
- Production build (same as GitHub Pages): `pnpm docs:build` — also builds the embedded **web demo** at `/web-demo/` (see `build:web-demo-for-docs` in root `package.json`)

## Which package?

| Package                | Use it when                                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **`@brother-ql/node`** | You ship a **Node.js** app or server and want TCP (`9100`) or **USB** printing with a small high-level client (`BrotherQlNodeClient`). |
| **`@brother-ql/web`**  | You ship a **browser** app (bundler) and want **WebUSB** or experimental **Direct Sockets TCP** (`BrotherQlWebClient`).                |
| **`@brother-ql/cli`**  | You want **parity-style commands** (`info models`, `info labels`, …) via `runCli()` for scripts or tooling — not for browser bundles.  |
| **`@brother-ql/core`** | You need protocol types, command generation, or registries **without** tying to a specific transport SDK.                              |

Lower-level transports: `@brother-ql/transport-node` and `@brother-ql/transport-web` implement `RuntimeTransport` for custom wiring.

## Usage

Use **Node.js 24+** for Node-targeted packages to match `engines` and CI. Browser usage requires a secure context (HTTPS or `localhost`) and a modern Chromium-based browser for WebUSB.

### From npm

After packages are published for your version:

```bash
pnpm add @brother-ql/node
```

### Print over TCP (`@brother-ql/node`)

Save as `print-tcp.ts` and run with `pnpm exec tsx print-tcp.ts` (adjust `host` / `model` / `label` for your printer):

```typescript
import { BrotherQlNodeClient } from "@brother-ql/node";

const client = new BrotherQlNodeClient({
  backend: "tcp",
  host: "192.168.1.50",
  port: 9100
});

const result = await client.print({
  model: "QL-710W",
  label: "62",
  imageBytes: new Uint8Array([255, 255, 0, 0]),
  timeoutMs: 2000
});

console.log(result);
```

### Print over USB (`@brother-ql/node`)

```typescript
import { BrotherQlNodeClient } from "@brother-ql/node";

const client = new BrotherQlNodeClient({ backend: "usb" });

const result = await client.print({
  model: "QL-820NWB",
  label: "62",
  imageBytes: new Uint8Array([255, 255, 0, 0])
});

console.log(result);
```

USB needs the native `usb` dependency and OS permissions; see the docs site for practical notes.

### CLI (`@brother-ql/cli`)

`runCli` is the programmatic entry (a thin shell binary is not wired yet). Example:

```typescript
import { runCli } from "@brother-ql/cli";

console.log(
  runCli(["info", "models"]).output.split("\n").slice(0, 8).join("\n")
);
console.log(
  runCli(["info", "labels"]).output.split("\n").slice(0, 8).join("\n")
);
```

Defaults come from env: `BROTHER_QL_BACKEND`, `BROTHER_QL_MODEL`, `BROTHER_QL_PRINTER`. The default runtime still stubs `print` / `send` / `discover` strings; `info models` and `info labels` use the real registry.

### Browser — WebUSB (`@brother-ql/web`)

Use **`connect()`** after a user gesture, then **`print()`** (see the [package README](packages/web/README.md) and [Try in browser](https://bankersman.github.io/brother-ql-node/guide/try-in-browser) on the docs site):

```typescript
import { BrotherQlWebClient } from "@brother-ql/web";

const client = new BrotherQlWebClient({ backend: "webusb" });
await client.connect();

const result = await client.print({
  model: "QL-820NWB",
  label: "62",
  imageBytes: new Uint8Array([255, 255, 0, 0]),
  timeoutMs: 30_000
});

await client.dispose();
```

## Packages

- `@brother-ql/core`: contracts, command generation, parity harness, and blocking send semantics.
- `@brother-ql/transport-node`: TCP and USB transport implementations for Node.
- `@brother-ql/node`: high-level SDK for **Node** applications (TCP/USB printing).
- `@brother-ql/transport-web`: low-level browser `RuntimeTransport` implementations (WebUSB, Direct Sockets TCP).
- `@brother-ql/web`: high-level SDK for **browser** applications (prefers `@brother-ql/web` over using `transport-web` directly in app code).
- `@brother-ql/cli`: parity-oriented command surface (`runCli`) for scripts and inspection.

## Development

- Install dependencies: `pnpm install`
- Build packages: `pnpm build`
- Validate quality gates:
  - `pnpm lint`
  - `pnpm format:check`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm test:coverage` (coverage report and thresholds; uploads in CI when Codecov is configured)

Releases: push a git tag `v*` whose numeric part matches the `version` field in every `packages/*/package.json`, then the [Release workflow](https://github.com/bankersman/brother-ql-node/actions/workflows/release.yml) publishes to npm. Configure [trusted publishing](https://docs.npmjs.com/trusted-publishers) for the `@brother-ql` scope (recommended), or add an `NPM_TOKEN` repository secret and pass it through the `token` input on `actions/setup-node` in that workflow.
