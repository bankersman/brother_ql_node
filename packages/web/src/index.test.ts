import { describe, expect, it } from "vitest";

import { BrotherQlWebClient } from "./index.js";
import type { DirectSocketsTcpTransport } from "@brother-ql/transport-web";
import type { WebUsbTransport } from "@brother-ql/transport-web";

describe("web sdk api", () => {
  it("connect + print uses webusb factory transport", async () => {
    let connected = false;
    const transport = {
      kind: "webusb" as const,
      connect: () => {
        connected = true;
        return Promise.resolve();
      },
      write: () => Promise.resolve(),
      read: () => Promise.resolve(new Uint8Array([2, 0, 0, 0])),
      dispose: () => Promise.resolve()
    };

    const client = new BrotherQlWebClient({
      backend: "webusb",
      transportFactory: {
        createWebUsbTransport: () => transport as unknown as WebUsbTransport,
        createTcpTransport: () => {
          throw new Error("Not expected.");
        }
      }
    });

    await client.connect();
    expect(connected).toBe(true);

    const response = await client.print({
      model: "QL-820NWB",
      label: "62",
      imageBytes: new Uint8Array([1])
    });

    expect(response.backend).toBe("webusb");
    expect(response.ok).toBe(true);
  });

  it("executes tcp path through factory transport", async () => {
    let disposed = false;
    const client = new BrotherQlWebClient({
      backend: "tcp",
      host: "192.168.1.10",
      port: 9101,
      transportFactory: {
        createWebUsbTransport: () => {
          throw new Error("Not expected in TCP test.");
        },
        createTcpTransport: ({ host, port }) => {
          const t = {
            kind: "network",
            connect: () => Promise.resolve(),
            write: () => Promise.resolve(),
            read: () => Promise.resolve(new Uint8Array([2, 0, 0, 0])),
            dispose: () => {
              disposed = true;
              return Promise.resolve();
            }
          } as unknown as DirectSocketsTcpTransport;
          expect(host).toBe("192.168.1.10");
          expect(port).toBe(9101);
          return t;
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

  it("rejects print on webusb when not connected", async () => {
    const client = new BrotherQlWebClient({ backend: "webusb" });
    await expect(
      client.print({
        model: "QL-820NWB",
        label: "62",
        imageBytes: new Uint8Array([1])
      })
    ).rejects.toThrow(/connect\(\) first/);
  });

  it("rejects connect when backend is tcp", async () => {
    const client = new BrotherQlWebClient({
      backend: "tcp",
      host: "127.0.0.1",
      port: 9100
    });
    await expect(client.connect()).rejects.toThrow(/only supported/);
  });
});
