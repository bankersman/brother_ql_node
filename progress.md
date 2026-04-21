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
- [x] Step 7 - Blocking Send and Status Semantics
- [x] Step 8 - USB Backend for Node
- [x] Step 9 - High-Level Node SDK API
- [x] Step 10 - CLI Package (`@brother-ql/cli`) V1 Parity
- [x] Step 11 - Developer and Consumer Documentation
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
- Completed Step 7 blocking send semantics:
  - Added blocking send flow that polls status readback to timeout window
  - Added status frame decoding and success/error completion criteria
  - Added tests for success, explicit error, and ambiguous timeout scenarios
- Completed Step 8 USB backend:
  - Added USB transport scaffold and device discovery API using `usb` (node-usb)
  - Added adapter abstraction to support testable USB device listing
  - Added unit tests for discovery behavior via injected adapter
- Completed Step 9 high-level Node SDK API:
  - Added `@brother-ql/node` package with ergonomic client API and backend selection
  - Added `print` entry point that routes through baseline command generation and transport send flow
  - Added SDK usage test for USB happy-path behavior
- Completed Step 10 CLI parity:
  - Added V1 command handlers for `print`, `send`, `info models`, and `info labels`
  - Added stable usage output for unsupported command forms
  - Added CLI command coverage tests for key command paths
- Completed Step 11 documentation:
  - Added root README with package overview and development commands
  - Added package READMEs for core and node transport packages
  - Added contribution guide and development workflow documentation
