# Golden Command Fixtures

This folder stores protocol fixtures used to compare Node output with upstream Python output.

## Recommended Fixture Set
- `mono-basic.json`: mono print, no compression, endless label.
- `mono-compressed.json`: mono print with compression on supported model.
- `die-cut-rotated.json`: die-cut label with rotation behavior.
- `two-color-red.json`: QL-8xx two-color command stream.

## Fixture Schema
```json
{
  "name": "mono-basic",
  "model": "QL-710W",
  "label": "62",
  "options": {
    "rotate": "auto",
    "compress": false,
    "cut": true,
    "dpi_600": false,
    "red": false,
    "threshold": 70,
    "dither": false
  },
  "input_image": "fixtures/images/example.png",
  "instruction_hex": "1b4067..."
}
```
