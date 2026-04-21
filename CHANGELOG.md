# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project aims to follow Semantic Versioning.

## [Unreleased]

### Added

- Initial planning and tracking artifacts:
  - `PLAN.md`
  - `progress.md`
  - `.gitignore`
- Workspace and tooling foundation:
  - Added pnpm workspace configuration and root scripts for lint, format, typecheck, and tests
  - Added strict TypeScript, ESLint, Prettier, and Vitest configurations
  - Scaffolded initial packages:
    - `@brother-ql/core`
    - `@brother-ql/transport-node`
    - `@brother-ql/cli`
    - `@brother-ql/transport-web`
- Core API contracts and types:
  - Added printer, label, print option, command buffer, and status frame domain contracts
  - Added runtime-agnostic transport interface and request types
  - Added exports map entries for package root and contracts entry point
- Golden command parity harness:
  - Added deterministic loader utilities for upstream fixture files
  - Added hex/byte assertion helpers for command stream parity tests
  - Added initial `mono-basic` fixture and passing harness coverage
- Baseline command generation MVP:
  - Added baseline command builder with cut, compression, and rotation behavior
  - Added representative fixture parity test coverage for command prefix alignment
- Expanded parity options:
  - Added threshold, dither, high-quality, and two-color option command handling
  - Added validation for invalid model/label identifiers and threshold bounds
- Node TCP transport backend:
  - Added network transport implementation for raw TCP (`9100`) printer communication
  - Added lifecycle and timeout semantics with integration-style coverage
