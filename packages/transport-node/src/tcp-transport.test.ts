import net from "node:net";

import { afterEach, describe, expect, it } from "vitest";

import { TcpTransport } from "./tcp-transport.js";

const servers: net.Server[] = [];

afterEach(async () => {
  await Promise.all(
    servers
      .splice(0, servers.length)
      .map(
        (server) =>
          new Promise<void>((resolve) => server.close(() => resolve()))
      )
  );
});

describe("tcp transport", () => {
  it("supports connect write read and dispose", async () => {
    const server = net.createServer((socket) => {
      socket.on("data", () => {
        socket.write(Buffer.from([0x20, 0x21]));
      });
    });
    servers.push(server);
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve)
    );
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Expected TCP address.");
    }

    const transport = new TcpTransport({
      host: "127.0.0.1",
      port: address.port
    });

    await transport.connect();
    await transport.write({ data: new Uint8Array([0x10]) });
    const response = await transport.read();
    await transport.dispose();

    expect(Array.from(response)).toEqual([0x20, 0x21]);
  });

  it("times out when reading with no response", async () => {
    const server = net.createServer(() => {});
    servers.push(server);
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve)
    );
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Expected TCP address.");
    }

    const transport = new TcpTransport({
      host: "127.0.0.1",
      port: address.port
    });

    await transport.connect();
    await expect(transport.read({ timeoutMs: 10 })).rejects.toThrow(
      "TCP read timed out."
    );
    await transport.dispose();
  });
});
