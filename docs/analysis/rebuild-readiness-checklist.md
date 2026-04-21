# Rebuild Readiness Checklist

## Knowledge Capture
- [x] Upstream module map documented.
- [x] Protocol command map and sequencing documented.
- [x] Model and label registries extracted to JSON.
- [x] Image conversion contract documented.
- [x] Backend contract and status semantics documented.
- [x] CLI parity matrix with v1 scope documented.
- [x] Validation strategy and scenario matrix documented.

## Remaining Pre-Implementation Decisions
- [ ] Choose Node image stack (sharp/canvas/jimp) and verify 1-bit parity feasibility.
- [ ] Choose USB stack for Node 24 and cross-platform support policy.
- [ ] Confirm v1 scope for P-touch models (`PT-*`) versus QL-only start.
- [ ] Confirm packaging/license strategy given upstream GPL-3.0 source.

## Definition Of Ready
Project is ready to start coding when:
1. Remaining decisions above are agreed.
2. First golden fixtures are generated from Python.
3. Node project scaffold and test harness are created.
