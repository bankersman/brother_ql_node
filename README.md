# brother-ql-node

TypeScript workspace for Brother QL printing on modern Node.js, with incremental parity against upstream `brother_ql`.

## Packages

- `@brother-ql/core`: contracts, command generation, parity harness, and blocking send semantics.
- `@brother-ql/transport-node`: TCP and USB transport implementations.
- `@brother-ql/node`: high-level SDK for Node applications.
- `@brother-ql/cli`: V1 parity command surface for common operations.
- `@brother-ql/transport-web`: stretch package for browser transport experiments.

## Development

- Install dependencies: `pnpm install`
- Validate quality gates:
  - `pnpm lint`
  - `pnpm format:check`
  - `pnpm typecheck`
  - `pnpm test`

See `CONTRIBUTING.md` and `docs/development-workflow.md` for contribution and workflow details.
