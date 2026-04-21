# Brother QL Parity Matrix

This matrix defines the QL-focused parity contract for this remediation track.

## Scope

- Included:
  - `print`, `send`, `discover`, `info models`, `info labels`, `info env`
  - Network (`tcp://`) backend
  - USB backend via Node `usb`
  - Full image conversion and raster command generation for QL models
- Excluded in this track:
  - `analyze`
  - `linux_kernel` backend

## Upstream To TypeScript Mapping

| Upstream module | Upstream responsibility | TS target module | Current status | Parity requirement |
| --- | --- | --- | --- | --- |
| `cli.py` | command dispatch, env-backed globals, print/send/info/discover | `packages/cli/src/index.ts` | Stubbed outputs | Real command execution with option/env parity |
| `models.py` | model capabilities and protocol flags | `packages/core/src/data/models.json` + typed registry module | Data only | Typed registry + capability helpers |
| `labels.py` | label geometry/compatibility metadata | `packages/core/src/data/labels.json` + typed registry module | Data only | Typed registry + compatibility validation |
| `conversion.py` | image normalization, geometry, threshold/dither, two-color masks | new modules under `packages/core/src/` | Missing | Feature-equivalent processing rules |
| `raster.py` | command sequencing, media packet, raster row packing/compression | `packages/core/src/command-generator.ts` + new raster modules | Placeholder | Full opcode and row-level parity |
| `reader.py` | status frame parsing and semantic decoding | `packages/core/src/blocking-send.ts` + new parser modules | Simplified | Real frame parser with bitfield mapping |
| `backends_network.py` | tcp URI parse, connect/write/read semantics | `packages/transport-node/src/tcp-transport.ts` | Partial | Harden and align behavior |
| `backends_pyusb.py` | discovery and endpoint I/O lifecycle | `packages/transport-node/src/usb-transport.ts` | Discovery-only + stubs | Real endpoint lifecycle + typed errors |
| `backends_helpers.py` | backend selection and blocking send outcomes | `packages/node/src/index.ts`, `packages/core/src/blocking-send.ts` | Partial | Outcome semantics aligned to upstream |

## Non-Parity Paths To Replace

- `packages/core/src/command-generator.ts`:
  - currently emits minimal command skeleton and placeholder payload marker
- `packages/transport-node/src/usb-transport.ts`:
  - `connect`/`write`/`read`/`dispose` are no-op
- `packages/cli/src/index.ts`:
  - command behavior is currently hardcoded text responses
- `packages/core/src/blocking-send.ts`:
  - status decoding does not follow real Brother frame format

## Strict Acceptance Criteria

1. Golden fixtures must pass byte-identical full stream assertions (not prefix checks).
2. Label/model constraints must reject invalid combinations with deterministic typed errors.
3. Network and USB transports must perform real I/O lifecycle with timeout handling.
4. CLI commands in scope must execute real code paths and support env-backed globals.
5. Status parsing must decode real frame structure and map error/phase semantics correctly.

## Phase Gates

Between every phase, run and pass:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`

Then update `progress.parity.md`, `CHANGELOG.md`, and commit atomically.
