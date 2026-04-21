# Development Workflow

## Workspace Layout

- `packages/core`
- `packages/transport-node`
- `packages/node`
- `packages/web` — browser SDK (`@brother-ql/web`)
- `packages/web/demo` — Vite demo (`@brother-ql/web-demo`, private)
- `packages/cli`
- `packages/transport-web`

## Documentation site and embedded web demo

`pnpm docs:build` runs `build:web-demo-for-docs` first: it builds `@brother-ql/web-demo` with a `base` path aligned to VitePress, copies the output to `docs/src/public/web-demo/` (VitePress `public` lives next to `srcDir`, which is `docs/src`), then runs `vitepress build`. The static demo is served at `/web-demo/` on the deployed site.

For local VitePress dev, `/web-demo/` is only present after a successful `pnpm docs:build` (or after running `pnpm run build:web-demo-for-docs` alone), because that folder is merged into the VitePress output from `docs/src/public`.

## Browser demo (development server)

```bash
pnpm --filter @brother-ql/web-demo dev
```

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
