---
layout: home

hero:
  name: brother-ql-node
  text: Brother QL printing from Node.js or the browser
  tagline: TypeScript port of brother_ql for Node TCP/USB, CLI workflows, and Chromium WebUSB (experimental Direct Sockets TCP).
  actions:
    - theme: brand
      text: App integration
      link: /guide/app-integration
    - theme: alt
      text: Supported printers & media
      link: /guide/supported-hardware-and-media
    - theme: alt
      text: Repository
      link: https://github.com/bankersman/brother-ql-node
    - theme: alt
      text: Try in browser
      link: /guide/try-in-browser

features:
  - title: Ported registry data
    details: Model and label identifiers are ported from the upstream brother_ql datasets so invalid model and media combinations can be rejected before print.
    link: /guide/supported-hardware-and-media
    linkText: View supported hardware
  - title: TCP and USB transports
    details: High-level APIs are designed for Node.js servers and desktop tooling with practical guidance for USB permissions and network printers.
    link: /guide/app-integration
    linkText: Integrate in your app
  - title: CLI surface
    details: Commands map to common brother_ql workflows for inspection, send operations, and scripting.
    link: /cli/overview
    linkText: CLI usage
  - title: Browser SDK
    details: Use @brother-ql/web for WebUSB printing from a secure page; optional experimental TCP via Chrome Direct Sockets.
    link: /guide/try-in-browser
    linkText: Try in browser

footer: |
  <p><strong>Acknowledgements</strong> — This project is not affiliated with Brother Industries. It is an independent TypeScript port.</p>
  <p>Deep thanks to <strong>Philipp Klaus</strong> for <a href="https://github.com/pklaus/brother_ql" target="_blank" rel="noreferrer">brother_ql</a>: protocol groundwork, model and label registries, and long-running maintenance that made this port possible.</p>
---
