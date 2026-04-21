# Contributing

## Requirements

- Node.js 24+
- pnpm

## Workflow

1. Implement only the scoped step from `PLAN.md`.
2. Run:
   - `pnpm lint`
   - `pnpm format:check`
   - `pnpm typecheck`
   - `pnpm test`
3. Update:
   - `progress.md`
   - `CHANGELOG.md` under `[Unreleased]`
4. Create an atomic commit for the step.

## Architecture References

- `docs/analysis/architecture.md`
- `docs/analysis/backends.md`
- `docs/analysis/protocol-map.md`
