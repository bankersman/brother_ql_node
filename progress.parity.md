# Parity Remediation Progress

Tracking progress for the new QL parity remediation track (separate from previous rounds).

## Phase Checklist

- [x] Phase 1: Freeze Scaffolding and Define Parity Contracts
- [x] Phase 2: Model/Label Registry and Validation Layer
- [x] Phase 3: Real Image Conversion Pipeline (Parity-Critical)
- [x] Phase 4: Raster/Protocol Encoder Replacement
- [x] Phase 5: Status Frame Parser + Blocking Send Semantics
- [x] Phase 6: Transport Parity
- [x] Phase 7: CLI Parity Implementation
- [x] Phase 8: Strict Fixture Expansion and Release Gating

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
- Completed Phase 2:
  - Added typed model and label registry helpers backed by upstream datasets
  - Added compatibility validation for restricted model-label combinations
  - Added two-color support validation for red labels
- Completed Phase 3:
  - Added image pipeline module with alpha normalization, geometry transforms, and auto-rotate validation
  - Added mono conversion logic with threshold and Floyd-Steinberg dither paths
  - Added two-color mask extraction helpers and test coverage
- Completed Phase 4:
  - Replaced placeholder command payload with raster row packing and protocol framing flow
  - Added media packet and row command generation for mono and two-color paths
  - Added invalidate preamble and final print terminator sequencing
- Completed Phase 5:
  - Added status parser with frame validation and error bitfield extraction
  - Routed blocking send decoding through the parser
  - Added network sent-only semantics for blocking send outcomes
- Completed Phase 6:
  - Replaced USB no-op behavior with connect/write/read/dispose lifecycle abstraction
  - Added Node USB adapter device open/close + transfer method contracts
  - Added lifecycle tests for USB transport behavior
- Completed Phase 7:
  - Replaced canned CLI outputs with runtime-backed command handlers for print/send/discover
  - Added `info env` and env-backed global option support (`BROTHER_QL_BACKEND`, `BROTHER_QL_MODEL`, `BROTHER_QL_PRINTER`)
  - Switched model/label info commands to typed core registries
- Completed Phase 8:
  - Added strict golden fixtures with expected full-stream SHA256 hashes
  - Added strict parity test matrix that validates full generated command stream fingerprints
  - Added `tsx` tooling to support deterministic fixture vector generation
