# @brother-ql/cli

**@brother-ql/cli** exposes a **parity-oriented command surface** for Brother QL workflows (for example `info models`, `info labels`, `print`, `send`, `discover`), backed by **`@brother-ql/core`** registry data. The primary API is **`runCli`** for embedding or scripting; a standalone shell binary is not the focus of this package yet.

**When to use:** automation, scripts, and tools that need **string-oriented** commands and registry inspection in **Node.js**. It does **not** run in the browser. For **programmatic printing** from an app, use **`@brother-ql/node`** (Node) or **`@brother-ql/web`** (browser).

## Documentation

- **Site:** [https://bankersman.github.io/brother-ql-node/](https://bankersman.github.io/brother-ql-node/)
- **CLI overview:** [https://bankersman.github.io/brother-ql-node/cli/overview](https://bankersman.github.io/brother-ql-node/cli/overview)
- **Troubleshooting:** [https://bankersman.github.io/brother-ql-node/guide/troubleshooting](https://bankersman.github.io/brother-ql-node/guide/troubleshooting)

## Install

```bash
pnpm add @brother-ql/cli
```

From the monorepo: `pnpm install`, `pnpm build`.

## Usage

```typescript
import { runCli } from "@brother-ql/cli";

const { output, exitCode } = runCli(["info", "models"]);
console.log(output);
```

Configuration defaults are driven by environment variables (see the docs site).

## Related packages

- **`@brother-ql/core`** — models, labels, and command generation
- **`@brother-ql/node`** — Node printing client (`BrotherQlNodeClient`) when you need programmatic TCP/USB I/O instead of CLI strings
- **`@brother-ql/web`** — browser printing client (`BrotherQlWebClient`) for WebUSB or experimental in-page TCP
