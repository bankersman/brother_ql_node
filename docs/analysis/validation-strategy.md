# Validation Strategy

## Primary Validation Goal
Guarantee Node-generated instruction bytes match upstream Python output for the same model, label, image, and options.

## Fixture Generation Strategy
1. Build canonical test images (mono, rotated, red-capable, different dimensions).
2. Run upstream Python `convert(...)` against each scenario.
3. Save fixture metadata + `instruction_hex` in `spec/upstream/golden-commands/*.json`.
4. Re-run Node implementation against same inputs and compare exact bytes.

## Scenario Matrix (Minimum)
- Mono endless label, default options.
- Mono endless with compression enabled.
- Die-cut label with auto-rotate path.
- Die-cut label mismatch error path.
- QL-8xx red mode with `62red`.
- `dpi_600` path.
- `cut=false` path.
- Model with no compression support (verify fallback/unsupported behavior).
- Model with no mode switch support (verify no-op/unsupported behavior).

## Assertion Levels
- **Byte exactness**: full instruction stream equality.
- **Opcode structure**: parse stream and verify expected sequence and flags.
- **Backend behavior**: mock transport writes/reads and blocking semantics.
- **Status decode**: validate parsed printer responses and error bit mapping.

## Tooling Recommendation
- Node test runner: `vitest` or `jest`.
- Binary snapshots: hex fixtures + Buffer comparison utilities.
- Optional protocol parser in Node to aid structural assertions and debugging.
