# V1 Release Candidate Checklist

## Quality

- [ ] `pnpm lint`
- [ ] `pnpm format:check`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`

## Consistency

- [ ] `CHANGELOG.md` includes all shipped deltas under `[Unreleased]`
- [ ] `progress.md` reflects completed implementation steps
- [ ] CI and Pages workflows run green on the release branch

## V1 Readiness

- [ ] No open high-severity blockers for scoped V1 features
- [ ] Transport limitations documented
- [ ] Rollout and rollback notes prepared
