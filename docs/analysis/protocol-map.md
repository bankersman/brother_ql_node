# Protocol Map (Raster Language)

## Core Command Opcodes (from `raster.py` and `reader.py`)
- Initialize: `1B 40`
- Status request: `1B 69 53`
- Switch mode: `1B 69 61 01` (gated by `model.mode_setting`)
- Invalidate buffer: `00` repeated `model.num_invalidate_bytes`
- Media/quality: `1B 69 7A` + 10-byte payload
- Auto cut: `1B 69 4D` + flag byte (gated by `model.cutting`)
- Cut every N: `1B 69 41` + count byte (gated by `model.cutting`)
- Expanded mode: `1B 69 4B` + flags (gated by `model.expanded_mode`)
- Margins: `1B 69 64` + `<H` feed dots
- Compression mode: `4D` + flag byte (gated by `model.compression`)
- Raster line mono: `67 00 <len> <row>`
- Raster line two-color: `77 01 <len> <black_row>` and `77 02 <len> <red_row>`
- Raster line P-touch: `47 <len_lo> <len_hi> <row>`
- Print final: `1A`
- Print intermediate: `0C`

## Print Job Sequencing (as used by `conversion.py`)
1. `add_switch_mode()` (ignore unsupported)
2. `add_invalidate()`
3. `add_initialize()`
4. `add_switch_mode()` again (ignore unsupported)
5. For each image:
   1. `add_status_information()`
   2. set `mtype`, `mwidth`, `mlength`, `pquality`
   3. `add_media_and_quality(raster_rows)`
   4. optional `add_autocut(True)` + `add_cut_every(1)`
   5. set expanded mode flags (`cut_at_end`, `dpi_600`, `two_color_printing`)
   6. `add_expanded_mode()` when supported
   7. `add_margins(feed_margin)`
   8. optional `add_compression(True)` when supported
   9. `add_raster_data(...)`
   10. `add_print()`

## Model-Dependent Behavior
- `mode_setting=false` => switch-mode command is unsupported.
- `cutting=false` => auto-cut/cut-every commands unsupported.
- `expanded_mode=false` => expanded-mode command unsupported.
- `compression=false` => compression command unsupported.
- `two_color=false` => two-color expanded flag invalid.
- `number_bytes_per_row` changes expected raster width.
- `num_invalidate_bytes` is typically 200, but 400 on QL-8xx.

## Encoding Details That Must Match
- `media_and_quality` uses little-endian `<L` for raster row count.
- `margins` uses little-endian `<H`.
- Rows are generated from image data after horizontal flip.
- With compression enabled, rows are PackBits encoded.
- For QL mono rows, `len` is one byte; for P-touch, `len` is two bytes.

## Status Frame Interpretation (`reader.py`)
- Expected status response signature: `80 20 42`.
- Error bytes:
  - byte 8: media/cutter/power/fan related bits.
  - byte 9: replace media/buffer/communication/cover/system bits.
- Important status fields:
  - byte 18: status type (`Printing completed`, `Phase change`, etc.)
  - byte 19: phase type (`Waiting to receive`, `Printing state`)
- Blocking send treats success as both:
  - status includes `Printing completed`
  - phase becomes `Waiting to receive`
