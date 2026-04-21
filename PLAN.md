# brother-ql-node Implementation Plan

## Goal

Build a reusable TypeScript printer library for Brother QL targeting modern Node.js (`>=24`), delivered incrementally with strict quality gates and commit discipline.

Primary target:
- Node runtime package(s) for reliable printer integration in Node applications.

Stretch target:
- Browser-compatible transport package (WebUSB-first), without blocking Node V1.

## Engineering Standards

- Runtime: Node 24
- Package manager: pnpm
- Language: TypeScript (strict mode)
- Formatting: Prettier
- Linting: ESLint (TypeScript-aware rules)
- Type safety: `tsc --noEmit`
- Testing:
  - Unit tests
  - Golden-command parity tests against upstream fixtures
  - Integration tests for transports where feasible
- Release hygiene:
  - Changelog maintained continuously
  - CI-gated merges

## Working Rules (Every Step)

For each implementation step:
1. Implement only the scoped delta.
2. Run sanity checks:
   - `pnpm lint`
   - `pnpm format:check`
   - `pnpm typecheck`
   - `pnpm test`
3. Update:
   - `progress.md` (status and notes)
   - `CHANGELOG.md` (`[Unreleased]` entries)
4. Commit the step atomically.

Definition of Done for each step:
- All checks pass locally.
- Documentation for that step is updated.
- Commit is created.

---

## Step 0 - Repository Bootstrap and Planning Ledger

### Scope
- Initialize git repository if not already initialized.
- Create and commit:
  - `progress.md` (full step checklist and progress log)
  - `CHANGELOG.md` (Keep a Changelog baseline)
- Add baseline ignore files (at minimum `.gitignore`).

### Gate
- `git status` clean after commit.
- `progress.md` contains all defined steps.

### Commit
- `chore(repo): initialize planning and tracking files`

## Step 1 - Workspace and Tooling Foundation

### Scope
- Establish package/workspace layout (recommended):
  - `packages/core`
  - `packages/transport-node`
  - `packages/cli` (optional early; can be deferred)
  - `packages/transport-web` (placeholder for stretch track)
- Configure root tooling:
  - pnpm workspace config (`pnpm-workspace.yaml`)
  - TypeScript base config
  - ESLint config
  - Prettier config
  - Test runner setup (Vitest or Jest)
  - Scripts: `lint`, `format`, `format:check`, `typecheck`, `test`
- Enforce Node 24 through `engines`.

### Gate
- Lint, format check, typecheck, and tests pass on scaffold.

### Commit
- `chore(tooling): setup workspace, ts, lint, prettier, tests`

## Step 2 - Core Package Skeleton (`@brother-ql/core`)

### Scope
- Define public API contracts and core domain types:
  - printer model and label metadata
  - print option schema
  - instruction/command buffer abstractions
  - status frame/domain model
  - runtime-agnostic transport interface
- Define package entry points and exports map.

### Gate
- Core package compiles cleanly.
- Type-level and unit tests for schema and contracts pass.

### Commit
- `feat(core): add core api contracts and types`

## Step 3 - Golden Fixture Harness

### Scope
- Integrate upstream golden fixtures from `spec/upstream/golden-commands`.
- Build test harness to compare generated commands with fixture expectations.
- Add deterministic fixture loading and assertion utilities.

### Gate
- Golden tests pass for initial fixture subset.
- Test results are deterministic across runs.

### Commit
- `test(core): add golden command parity harness`

## Step 4 - Command Generation MVP

### Scope
- Implement baseline mono command generation:
  - basic label handling
  - compression toggle behavior
  - cut/no-cut behavior
  - baseline rotation support
- Achieve end-to-end parity for at least one representative fixture.

### Gate
- Baseline fixture parity tests pass.
- Existing checks remain green.

### Commit
- `feat(core): implement baseline command generation`

## Step 5 - Command Generation Parity Expansion

### Scope
- Expand support to remaining V1 option set:
  - threshold/dither
  - red/two-color modes (supported models)
  - 600dpi and quality flags
  - model/label edge cases
- Expand fixture matrix and negative tests.

### Gate
- Target parity fixture matrix passes.
- Error handling tests pass.

### Commit
- `feat(core): extend command generation parity options`

## Step 6 - Node Transport Package (`@brother-ql/transport-node`) - Network First

### Scope
- Implement raw TCP backend (`9100`) for Node.
- Implement transport lifecycle:
  - connect/write/read/dispose
  - timeout handling
- Map transport failures to core error taxonomy.

### Gate
- Unit tests for transport behavior and timeout semantics pass.
- Integration smoke coverage in place (mock or controlled endpoint).

### Commit
- `feat(node-transport): add tcp backend implementation`

## Step 7 - Blocking Send and Status Semantics

### Scope
- Implement blocking send flow aligned to analysis:
  - poll readback up to timeout window
  - validate success criteria from status and phase types
- Document network limitations where full completion cannot be guaranteed.

### Gate
- Tests cover success, timeout, and ambiguous completion scenarios.

### Commit
- `feat(core): implement blocking send status semantics`

## Step 8 - USB Backend for Node

### Scope
- Add USB backend implementation in `transport-node`.
- Support Windows/macOS/Linux via selected USB library.
- Add device listing/discovery support.
- Keep `linux_kernel` backend optional/deferred unless needed.

### Gate
- Unit tests pass.
- API-level integration tests for USB discovery and I/O behavior pass where feasible.

### Commit
- `feat(node-transport): add usb backend and discovery`

## Step 9 - High-Level Node SDK API

### Scope
- Provide ergonomic SDK API for Node applications:
  - client creation
  - backend selection
  - print/send entry points
- Improve typed errors and return contracts for DX.

### Gate
- SDK usage tests pass (happy path and failures).
- Type tests validate API ergonomics.

### Commit
- `feat(node): add high-level sdk api`

## Step 10 - CLI Package (`@brother-ql/cli`) V1 Parity

### Scope
- Implement priority CLI commands:
  - `print`
  - `send`
  - `info models`
  - `info labels`
- Implement global env var support from parity matrix.
- Keep deferred commands explicitly documented.

### Gate
- CLI integration tests pass for key flows.
- Help/output snapshots pass.

### Commit
- `feat(cli): add v1 parity commands`

## Step 11 - Developer and Consumer Documentation

### Scope
- Write root and package READMEs.
- Add contribution guide and development workflow docs.
- Document architecture, transports, limitations, and examples.

### Gate
- Documentation examples validate successfully (where testable).

### Commit
- `docs: add package usage and contributor documentation`

## Step 12 - Browser Stretch Package (`@brother-ql/transport-web`) [Non-blocking]

### Scope
- Scaffold browser transport package.
- Implement WebUSB proof-of-concept transport.
- Document browser constraints (secure context, permission prompts, compatibility).
- Keep browser raw TCP explicitly experimental/deferred.

### Gate
- Web package build and typecheck pass.
- Browser validation protocol documented and executed.

### Commit
- `feat(web-transport): add webusb proof of concept`

## Step 13 - CI/CD Automation (GitHub Actions)

### Scope
- Add PR validation workflow:
  - lint
  - format check
  - typecheck
  - tests
- Add release workflow strategy (manual or tag-driven).
- Add status badges to docs.

### Gate
- Workflows execute successfully on clean branch.

### Commit
- `ci: add github actions for validation and release`

## Step 14 - GitHub Pages Developer Docs

### Scope
- Configure docs build and GitHub Pages deployment.
- Publish developer documentation (architecture, API, troubleshooting).
- Wire docs checks into CI.

### Gate
- Docs build succeeds in CI.
- Published Pages site is reachable.

### Commit
- `docs(site): publish developer docs via github pages`

## Step 15 - Hardening and Release Candidate

### Scope
- Run final quality and consistency pass.
- Validate changelog completeness and release process.
- Prepare V1 release candidate criteria and checklist.

### Gate
- Full pipeline green.
- No open high-severity blockers for V1 scope.

### Commit
- `chore(release): prepare v1 release candidate`
