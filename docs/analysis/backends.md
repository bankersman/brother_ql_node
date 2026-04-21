# Backend Analysis

## Upstream Backends
- `pyusb`: USB transport using libusb/PyUSB.
- `linux_kernel`: direct `/dev/usb/lp*` read/write (Linux only).
- `network`: raw TCP socket, default port `9100`.

## Backend Identifier Rules
- `usb://...` or `0x...` => `pyusb`
- `file://...`, `/dev/usb/...`, or `lp...` => `linux_kernel`
- `tcp://...` => `network`

## Common Backend Contract (Node Proposal)
- `connect(printerIdentifier): Promise<void>`
- `write(data: Buffer): Promise<void>`
- `read(length?: number): Promise<Buffer>`
- `dispose(): Promise<void>`
- `listAvailableDevices(): Promise<DeviceInfo[]>`

## Package Architecture Decision
- Prefer a multi-package structure over a single hybrid package.
- Keep command generation and shared protocol logic in `@brother-ql/core`.
- Implement runtime-specific transports in separate packages:
  - `@brother-ql/transport-node` for Node backends (`network`, `usb`, optional `linux_kernel`).
  - `@brother-ql/transport-web` for browser backends (stretch target, `webusb` first).
- Keep CLI concerns in a Node-only package (for example `@brother-ql/cli`) that consumes `core` plus `transport-node`.
- Use one shared transport interface across packages so behavior stays consistent while platform APIs remain isolated.

## Status Semantics
- Blocking send (`helpers.send`) polls readback for up to 10 seconds.
- Success condition requires:
  - status type `Printing completed`
  - phase type `Waiting to receive`
- Network backend returns early and cannot guarantee print-state confirmation.

## Error Taxonomy To Preserve
- Connection/transport errors (connect, timeout, write, read).
- Unsupported backend identifier or backend type.
- Printer status errors decoded from response bits.
- Ambiguous completion warnings when expected statuses are not observed.

## Node Implementation Priorities
1. Implement `network` first (cross-platform baseline).
2. Add USB backend abstraction compatible with Windows/macOS/Linux (likely `usb` package).
3. Keep `linux_kernel` optional and Linux-only.
4. Expose explicit `blocking` behavior with documented limitations on network mode.

## Browser Stretch Scope
- Treat browser support as an explicit stretch goal, not a V1 parity requirement.
- Prioritize `webusb` as the primary browser transport in Chromium-based browsers.
- Consider browser raw TCP support experimental and capability-gated; do not make it a baseline promise.
- Document runtime constraints clearly (user gesture, permissions, secure context, device support).
