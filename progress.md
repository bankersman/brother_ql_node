# Progress Log

Tracking implementation progress against `PLAN.md`.

## Step Checklist

- [x] Step 0 - Repository Bootstrap and Planning Ledger
- [x] Step 1 - Workspace and Tooling Foundation
- [x] Step 2 - Core Package Skeleton (`@brother-ql/core`)
- [x] Step 3 - Golden Fixture Harness
- [x] Step 4 - Command Generation MVP
- [x] Step 5 - Command Generation Parity Expansion
- [x] Step 6 - Node Transport Package (`@brother-ql/transport-node`) - Network First
- [ ] Step 7 - Blocking Send and Status Semantics
- [ ] Step 8 - USB Backend for Node
- [ ] Step 9 - High-Level Node SDK API
- [ ] Step 10 - CLI Package (`@brother-ql/cli`) V1 Parity
- [ ] Step 11 - Developer and Consumer Documentation
- [ ] Step 12 - Browser Stretch Package (`@brother-ql/transport-web`) [Non-blocking]
- [ ] Step 13 - CI/CD Automation (GitHub Actions)
- [ ] Step 14 - GitHub Pages Developer Docs
- [ ] Step 15 - Hardening and Release Candidate

## Log

### 2026-04-21

- Initialized repository tracking files for Step 0:
  - Added `progress.md`
  - Added `CHANGELOG.md`
  - Added `.gitignore`
- Completed Step 1 workspace and tooling foundation:
  - Added pnpm workspace and root package scripts for lint/format/typecheck/test
  - Added TypeScript strict base config, ESLint config, Prettier config, and Vitest setup
  - Scaffolded package layout for `core`, `transport-node`, `cli`, and `transport-web`
  - Added initial scaffold tests and passed full quality gate locally
- Completed Step 2 core package skeleton:
  - Added core domain contracts for models, labels, options, command buffers, status frames, and transport interface
  - Added package exports map for root and contracts entry points
  - Added type-level coverage in unit tests for contract usability
- Completed Step 3 golden fixture harness:
  - Added deterministic JSON fixture loading for golden command fixtures
  - Added reusable hex/byte conversion helpers for parity assertions
  - Added initial upstream fixture subset with passing harness tests
- Completed Step 4 command generation MVP:
  - Added baseline command generation flow with initialize, compression, rotation, and cut toggles
  - Added representative parity test against golden fixture prefix
  - Preserved green checks for existing scaffold and harness suites
- Completed Step 5 command generation parity expansion:
  - Added quality, dither, threshold, and two-color command flags in baseline generator
  - Added input validation for model/label and threshold bounds
  - Added expanded option and negative-path tests
- Completed Step 6 network-first node transport:
  - Added TCP transport backend with connect, write, read, and dispose lifecycle
  - Added timeout handling for connect/write/read operations
  - Added integration-style tests for successful flow and read timeout behavior
