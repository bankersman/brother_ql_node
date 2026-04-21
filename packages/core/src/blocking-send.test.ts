import { describe, expect, it } from "vitest";

import type { RuntimeTransport } from "./contracts.js";
import { sendBlocking } from "./blocking-send.js";

function createStubTransport(statusFrames: Uint8Array[]): RuntimeTransport {
  let index = 0;
  return {
    kind: "network",
    connect: async () => {},
    write: async () => {},
    read: () =>
      Promise.resolve(
        statusFrames[Math.min(index++, statusFrames.length - 1)]!
      ),
    dispose: async () => {}
  };
}

describe("blocking send semantics", () => {
  it("resolves completion when status indicates success", async () => {
    const result = await sendBlocking({
      transport: createStubTransport([new Uint8Array([2, 0, 0])]),
      payload: new Uint8Array([0x1b, 0x40]),
      timeoutMs: 100
    });

    expect(result.completed).toBe(true);
    expect(result.ambiguous).toBe(false);
  });

  it("returns non-ambiguous error on explicit error frame", async () => {
    const result = await sendBlocking({
      transport: createStubTransport([new Uint8Array([255, 3, 1])]),
      payload: new Uint8Array([0x1b, 0x40]),
      timeoutMs: 100
    });

    expect(result.completed).toBe(false);
    expect(result.ambiguous).toBe(false);
  });

  it("returns ambiguous completion on timeout", async () => {
    const result = await sendBlocking({
      transport: createStubTransport([new Uint8Array([1, 0, 0])]),
      payload: new Uint8Array([0x1b, 0x40]),
      timeoutMs: 1,
      pollIntervalMs: 1
    });

    expect(result.completed).toBe(false);
    expect(result.ambiguous).toBe(true);
  });
});
