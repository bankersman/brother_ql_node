import { generateBaselineCommand, sendBlocking } from "@brother-ql/core";
import { TcpTransport, UsbTransport } from "@brother-ql/transport-node";

export type NodeBackend = "tcp" | "usb";

export interface BrotherQlNodeClientOptions {
  backend: NodeBackend;
  host?: string;
  port?: number;
  transportFactory?: {
    createUsbTransport(): UsbTransport;
    createTcpTransport(input: { host: string; port: number }): TcpTransport;
  };
}

export class BrotherQlNodeClient {
  constructor(private readonly options: BrotherQlNodeClientOptions) {}

  async print(input: {
    model: string;
    label: string;
    imageBytes: Uint8Array;
    timeoutMs?: number;
  }) {
    const command = generateBaselineCommand({
      model: input.model,
      label: input.label,
      imageBytes: input.imageBytes
    });

    if (this.options.backend === "usb") {
      const transport =
        this.options.transportFactory?.createUsbTransport() ??
        new UsbTransport();
      await transport.connect();
      await transport.write({ data: command.bytes });
      await transport.dispose();
      return { ok: true as const, backend: "usb" as const };
    }

    const host = this.options.host ?? "127.0.0.1";
    const port = this.options.port ?? 9100;
    const transport =
      this.options.transportFactory?.createTcpTransport({ host, port }) ??
      new TcpTransport({ host, port });
    const result = await sendBlocking({
      transport,
      payload: command.bytes,
      timeoutMs: input.timeoutMs ?? 1000
    });
    await transport.dispose();
    return { ok: result.completed, backend: "tcp" as const, result };
  }
}
