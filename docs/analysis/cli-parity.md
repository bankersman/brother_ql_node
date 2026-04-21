# CLI Parity Matrix

## Scope Clarification
- CLI parity targets apply to Node runtime only.
- Browser compatibility is tracked as a separate transport package effort, not CLI parity.
- Shared printing behavior should come from a common core library so Node and browser drivers remain aligned.

## Global Options
- `-b, --backend` (env: `BROTHER_QL_BACKEND`)
- `-m, --model` (env: `BROTHER_QL_MODEL`)
- `-p, --printer` (env: `BROTHER_QL_PRINTER`)
- `--debug`
- `--version`

## Commands
- `discover`
- `info models`
- `info labels`
- `info env`
- `print`
- `analyze`
- `send`

## `print` Option Parity
- `-l, --label` (env: `BROTHER_QL_LABEL`)
- `-r, --rotate` (`auto|0|90|180|270`)
- `-t, --threshold` (float percent)
- `-d, --dither`
- `-c, --compress`
- `--red`
- `--600dpi`
- `--lq`
- `--no-cut`

## Parity Targeting
### Must-Have V1
- `print` with all options above.
- `send` for prebuilt instruction files.
- `info models` and `info labels`.
- Global env var support.
- Package target: `@brother-ql/core` + `@brother-ql/transport-node` (+ Node CLI wrapper).

### Nice-To-Have
- `analyze` (instruction to image decoding for diagnostics).
- `discover` (backend-specific discovery depending on library support).
- `info env` equivalent diagnostics.
- First browser milestone: `@brother-ql/transport-web` proof-of-concept using `webusb`.

### Defer Candidates
- Full parity of Python `info env` package-report formatting.
- USB discovery edge-cases until backend library choice is finalized.
- Browser raw TCP transport beyond controlled experimentation.
