import { describe, expect, it } from "vitest";

import { BrotherQlNodeClient } from "./index.js";
import type { TcpTransport } from "@brother-ql/transport-node";
import { UsbTransport } from "@brother-ql/transport-node";

describe("node sdk api", () => {
  it("constructs usb client and executes print path", async () => {
    const client = new BrotherQlNodeClient({
      backend: "usb",
      transportFactory: {
        createUsbTransport: () =>
          new UsbTransport({
            listDevices: () =>
              Promise.resolve([{ vendorId: 0x04f9, productId: 0x209b }]),
            openDevice: () => Promise.resolve(),
            transferOut: () => Promise.resolve(),
            transferIn: () => Promise.resolve(new Uint8Array()),
            closeDevice: () => Promise.resolve()
          }),
        createTcpTransport: () => {
          throw new Error("Not expected in USB test.");
        }
      }
    });
    const response = await client.print({
      model: "QL-820NWB",
      label: "62",
      imageBytes: new Uint8Array([1])
    });

    expect(response.ok).toBe(true);
    expect(response.backend).toBe("usb");
  });

  it("executes tcp path through factory transport", async () => {
    let disposed = false;
    const client = new BrotherQlNodeClient({
      backend: "tcp",
      host: "192.168.1.10",
      port: 9101,
      transportFactory: {
        createUsbTransport: () => {
          throw new Error("Not expected in TCP test.");
        },
        createTcpTransport: ({ host, port }) => {
          const transport = {
            kind: "network",
            connect: () => Promise.resolve(),
            write: () => Promise.resolve(),
            read: () => Promise.resolve(new Uint8Array([2, 0, 0, 0])),
            dispose: () => {
              disposed = true;
              return Promise.resolve();
            }
          } as unknown as TcpTransport;
          expect(host).toBe("192.168.1.10");
          expect(port).toBe(9101);
          return transport;
        }
      }
    });

    const response = await client.print({
      model: "QL-710W",
      label: "62",
      imageBytes: new Uint8Array([1, 2, 3]),
      timeoutMs: 10
    });
    expect(response.backend).toBe("tcp");
    expect(disposed).toBe(true);
  });
});
