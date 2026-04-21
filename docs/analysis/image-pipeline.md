# Image Pipeline Equivalence Contract

## Conversion Entry Contract
- Inputs: `qlr`, `images[]`, `label`, options (`cut`, `dither`, `compress`, `red`, `rotate`, `dpi_600`, `hq`, `threshold`).
- Threshold conversion in upstream:
  - Accept percent value (default 70)
  - Convert to inverted 0..255 cutoff via `threshold = 100 - threshold`

## Normalization Rules
- Alpha channels: composited over white background.
- Palette mode (`P`): converted to `RGB` for red mode, otherwise `L`.
- Gray mode (`L`) + red mode: upgraded to `RGB`.

## Geometry Rules
- Endless/P-touch endless:
  - Apply explicit rotation if set and not auto/0.
  - For `dpi_600`, halve width after optional rotate.
  - Resize to `dots_printable[0]` width if needed (LANCZOS).
  - Paste into full device width using right offset.
- Die-cut/round:
  - With `rotate=auto`, rotate 90 degrees if swapped dimensions match.
  - Reject mismatched dimensions with error.
  - For `dpi_600`, halve width after size check.
  - Paste into full device width.

## Binary Conversion Rules
- Mono path:
  - convert to `L`
  - invert
  - threshold or Floyd-Steinberg dither to mode `1`
- Two-color path:
  - build red mask with HSV filters and threshold
  - build black mask from dark values, subtract red mask
  - both masks converted to mode `1`

## Node Risk Areas
- Different resize kernels across libraries (sharp/jimp/canvas) may shift pixels.
- Dither implementation differences can change output bytes.
- HSV conversion details vary between libraries.
- Bit packing order in 1-bit images must match Pillow raw output contract.

## Acceptance Criteria
- For mono, produced instruction stream must be byte-identical for golden fixtures.
- For red mode, black and red raster rows must both match upstream.
- Dimension validation failures must produce deterministic, typed errors.
