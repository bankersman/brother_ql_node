# @brother-ql/core

**@brother-ql/core** holds the shared Brother QL protocol surface: model and label registries, image-to-raster conversion, command framing, status parsing, and blocking-send semantics. Higher-level packages (`@brother-ql/node`, `@brother-ql/web`, `@brother-ql/transport-node`, `@brother-ql/transport-web`, `@brother-ql/cli`) build on this layer; it has no printer I/O of its own.

## Documentation

Full user and integration docs live on **GitHub Pages**:

- **Site:** [https://bankersman.github.io/brother-ql-node/](https://bankersman.github.io/brother-ql-node/)
- **Start:** [https://bankersman.github.io/brother-ql-node/](https://bankersman.github.io/brother-ql-node/)
- **Analysis / parity notes:** [https://bankersman.github.io/brother-ql-node/reference/analysis-notes](https://bankersman.github.io/brother-ql-node/reference/analysis-notes)

## Install

From npm (after a published release):

```bash
pnpm add @brother-ql/core
```

From the [brother-ql-node](https://github.com/bankersman/brother-ql-node) monorepo: clone, `pnpm install`, then `pnpm build` at the repository root.

## Usage

Most applications use **`@brother-ql/node`** (Node) or **`@brother-ql/web`** (browser) instead of core directly. When you need shared types or helpers without those SDKs:

```typescript
import { CORE_PACKAGE_NAME } from "@brother-ql/core";
import type { ModelDefinition } from "@brother-ql/core";
```

Stable type-only surface for cross-package contracts:

```typescript
import type {
  RuntimeTransport,
  TransportKind
} from "@brother-ql/core/contracts";
```

## Related packages

- **`@brother-ql/node`** — TCP/USB printing entry point for Node.js (`BrotherQlNodeClient`)
- **`@brother-ql/web`** — WebUSB / experimental in-browser TCP (`BrotherQlWebClient`)
- **`@brother-ql/transport-node`** — TCP and USB transports used by the Node SDK
- **`@brother-ql/transport-web`** — WebUSB and Direct Sockets transports used by the web SDK
- **`@brother-ql/cli`** — CLI-oriented commands backed by core registries (`runCli`)
