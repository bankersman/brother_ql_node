# Parity Remediation Progress

Tracking progress for the new QL parity remediation track (separate from previous rounds).

## Phase Checklist

- [x] Phase 1: Freeze Scaffolding and Define Parity Contracts
- [ ] Phase 2: Model/Label Registry and Validation Layer
- [ ] Phase 3: Real Image Conversion Pipeline (Parity-Critical)
- [ ] Phase 4: Raster/Protocol Encoder Replacement
- [ ] Phase 5: Status Frame Parser + Blocking Send Semantics
- [ ] Phase 6: Transport Parity
- [ ] Phase 7: CLI Parity Implementation
- [ ] Phase 8: Strict Fixture Expansion and Release Gating

## Phase Gate (Every Phase)

- Run and pass:
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
- Update:
  - `progress.parity.md`
  - `CHANGELOG.md` (`[Unreleased]`)
- Create one atomic commit before moving to the next phase.

## Log

### 2026-04-21

- Created new parity progress ledger.
- Initialized all phases as unchecked.
- Completed Phase 1:
  - Added explicit upstream-to-TS parity matrix in `docs/analysis/parity-matrix.md`
  - Recorded non-parity scaffold paths and strict acceptance criteria
