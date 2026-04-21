# Development Workflow

## Workspace Layout

- `packages/core`
- `packages/transport-node`
- `packages/node`
- `packages/cli`
- `packages/transport-web`

## Local Validation

Run the full quality gate before each step commit:

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
```

## Current Limitations

- Node 24 is the runtime target. Running under older Node versions is not supported for release readiness.
- Web transport remains a proof-of-concept track.
