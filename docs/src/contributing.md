# Contributing

Thanks for helping improve `brother-ql-node`.

## Local quality gate

Run this from repository root before opening a pull request:

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
```

## Docs workflow

```bash
pnpm docs:dev
pnpm docs:build
```

## Continuous integration

Pull requests run lint, format, typecheck, tests with coverage, and a docs build. Coverage is uploaded to [Codecov](https://codecov.io/gh/bankersman/brother-ql-node) when the repository has a **`CODECOV_TOKEN`** secret (create a token in Codecov for this repo and add it under GitHub **Settings → Secrets and variables → Actions**). Until then, uploads are skipped and CI still passes.

## Credits

This project rebuilds Brother QL workflows in TypeScript with strong respect for the original Python implementation and ecosystem work by **Philipp Klaus** in [`brother_ql`](https://github.com/pklaus/brother_ql) (protocol details, registries, and reference behavior).
