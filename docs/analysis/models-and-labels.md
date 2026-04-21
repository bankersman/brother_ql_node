# Models And Labels Registry Analysis

## Extracted Artifacts
- Models export: `spec/upstream/models.json`
- Labels export: `spec/upstream/labels.json`

## Model Registry Notes
- Total models extracted: 19.
- QL width classes:
  - 90 bytes/row models (720 dots)
  - 162 bytes/row models (1296 dots)
- P-touch models are present in upstream and use a different raster line opcode (`0x47`).
- Feature flags drive behavior, not model-name branching:
  - `mode_setting`
  - `cutting`
  - `expanded_mode`
  - `compression`
  - `two_color`
  - `num_invalidate_bytes`

## Label Registry Notes
- Total labels extracted: 28.
- Form factors:
  - `ENDLESS`
  - `DIE_CUT`
  - `ROUND_DIE_CUT`
  - `PTOUCH_ENDLESS`
- Critical per-label properties:
  - `dots_printable` (pixel geometry contract)
  - `offset_r` (right-side centering offset)
  - `feed_margin` (extra feed dots)
  - `restricted_to_models`
  - `color` (`BLACK_WHITE` vs `BLACK_RED_WHITE`)

## Invariants To Enforce In Node
- Die-cut/round labels must match required dimensions exactly (or rotated equivalent for auto-rotate).
- Endless labels must match target width; if not, resize width and preserve aspect ratio.
- Effective right offset is `label.offset_r + model.additional_offset_r`.
- QL-8xx red mode should only allow labels with black/red/white support and models with `two_color=true`.

## Porting Recommendation
- Treat these registries as generated source from upstream.
- Include a sync script later to detect drift when upstream tables change.
