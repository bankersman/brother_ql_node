import { DirectSocketsTcpTransport } from "@brother-ql/transport-web";
import { BrotherQlWebClient } from "@brother-ql/web";

const logEl = document.getElementById("log");

function log(...args: unknown[]): void {
  const line = args
    .map((a) => (a instanceof Error ? `${a.name}: ${a.message}` : String(a)))
    .join(" ");
  if (logEl) {
    logEl.textContent += `${line}\n`;
  }
}

function getModelLabel(): { model: string; label: string } {
  const model = (document.getElementById("model") as HTMLInputElement).value;
  const label = (document.getElementById("label") as HTMLInputElement).value;
  return { model, label };
}

async function getImageBytes(): Promise<Uint8Array> {
  const input = document.getElementById("image") as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return new Uint8Array([200]);
  }
  const buf = await file.arrayBuffer();
  return new Uint8Array(buf);
}

function getTcpHostPort(): { host: string; port: number } {
  const host = (document.getElementById("tcp-host") as HTMLInputElement).value;
  const port = Number(
    (document.getElementById("tcp-port") as HTMLInputElement).value
  );
  return { host, port };
}

let webUsbClient: BrotherQlWebClient | undefined;
let tcpReachable = false;
let tcpHost = "";
let tcpPort = 9100;

async function onWebUsbConnect(): Promise<void> {
  try {
    await webUsbClient?.dispose();
    webUsbClient = new BrotherQlWebClient({ backend: "webusb" });
    await webUsbClient.connect();
    log("WebUSB connected.");
  } catch (error: unknown) {
    log(error);
  }
}

async function onWebUsbPrint(): Promise<void> {
  if (!webUsbClient) {
    log("Connect WebUSB first.");
    return;
  }
  try {
    const { model, label } = getModelLabel();
    const imageBytes = await getImageBytes();
    const result = await webUsbClient.print({
      model,
      label,
      imageBytes,
      timeoutMs: 30_000
    });
    log("print (webusb):", JSON.stringify(result));
  } catch (error: unknown) {
    log(error);
  }
}

async function onTcpConnect(): Promise<void> {
  try {
    const { host, port } = getTcpHostPort();
    const probe = new DirectSocketsTcpTransport({ host, port });
    await probe.connect();
    await probe.dispose();
    tcpHost = host;
    tcpPort = port;
    tcpReachable = true;
    log("TCP connect OK (Direct Sockets). You can print (opens a new socket).");
  } catch (error: unknown) {
    tcpReachable = false;
    log(error);
  }
}

async function onTcpPrint(): Promise<void> {
  if (!tcpReachable) {
    log("Connect TCP first (validates Direct Sockets + host/port).");
    return;
  }
  try {
    const { model, label } = getModelLabel();
    const imageBytes = await getImageBytes();
    const client = new BrotherQlWebClient({
      backend: "tcp",
      host: tcpHost,
      port: tcpPort
    });
    const result = await client.print({
      model,
      label,
      imageBytes,
      timeoutMs: 15_000
    });
    log("print (tcp):", JSON.stringify(result));
  } catch (error: unknown) {
    log(error);
  }
}

document.getElementById("webusb-connect")?.addEventListener("click", () => {
  void onWebUsbConnect();
});

document.getElementById("webusb-print")?.addEventListener("click", () => {
  void onWebUsbPrint();
});

document.getElementById("tcp-connect")?.addEventListener("click", () => {
  void onTcpConnect();
});

document.getElementById("tcp-print")?.addEventListener("click", () => {
  void onTcpPrint();
});

const hasTcp =
  typeof (globalThis as unknown as { TCPSocket?: unknown }).TCPSocket ===
  "function";
log(
  `TCPSocket (Direct Sockets) available: ${hasTcp ? "yes" : "no — use an IWA or allowed origin"}`
);
