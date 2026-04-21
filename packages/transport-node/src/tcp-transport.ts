import net from "node:net";

import type {
  RuntimeTransport,
  TransportReadRequest,
  TransportWriteRequest
} from "@brother-ql/core";

export interface TcpTransportOptions {
  host: string;
  port?: number;
  connectTimeoutMs?: number;
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message: string
) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), timeoutMs);
    void promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error: unknown) => {
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error(String(error)));
      });
  });
}

export class TcpTransport implements RuntimeTransport {
  readonly kind = "network" as const;
  private readonly options: Required<TcpTransportOptions>;
  private socket: net.Socket | undefined;

  constructor(options: TcpTransportOptions) {
    this.options = {
      host: options.host,
      port: options.port ?? 9100,
      connectTimeoutMs: options.connectTimeoutMs ?? 1000
    };
  }

  async connect(): Promise<void> {
    if (this.socket) {
      return;
    }

    const socket = new net.Socket();
    await withTimeout(
      new Promise<void>((resolve, reject) => {
        socket.once("error", reject);
        socket.connect(this.options.port, this.options.host, () => resolve());
      }),
      this.options.connectTimeoutMs,
      "TCP connect timed out."
    );
    socket.removeAllListeners("error");
    this.socket = socket;
  }

  async write(request: TransportWriteRequest): Promise<void> {
    if (!this.socket) {
      throw new Error("Transport is not connected.");
    }

    await withTimeout(
      new Promise<void>((resolve, reject) => {
        this.socket?.write(request.data, (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      }),
      request.timeoutMs ?? 2000,
      "TCP write timed out."
    );
  }

  async read(request?: TransportReadRequest): Promise<Uint8Array> {
    if (!this.socket) {
      throw new Error("Transport is not connected.");
    }

    const timeoutMs = request?.timeoutMs ?? 2000;
    const size = request?.size;

    return withTimeout(
      new Promise<Uint8Array>((resolve, reject) => {
        const onData = (data: Buffer) => {
          this.socket?.off("error", onError);
          this.socket?.off("data", onData);
          resolve(new Uint8Array(size ? data.subarray(0, size) : data));
        };
        const onError = (error: Error) => {
          this.socket?.off("data", onData);
          this.socket?.off("error", onError);
          reject(error);
        };
        this.socket?.once("data", onData);
        this.socket?.once("error", onError);
      }),
      timeoutMs,
      "TCP read timed out."
    );
  }

  async dispose(): Promise<void> {
    if (!this.socket) {
      return;
    }

    const socket = this.socket;
    this.socket = undefined;
    await new Promise<void>((resolve) => {
      socket.end(() => resolve());
    });
  }
}
