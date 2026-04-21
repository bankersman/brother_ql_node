import { describe, expect, it } from "vitest";

import { CORE_PACKAGE_NAME } from "./index.js";
import type { PrintOptions, RuntimeTransport } from "./index.js";

describe("core package scaffold", () => {
  it("exposes package constant", () => {
    expect(CORE_PACKAGE_NAME).toBe("@brother-ql/core");
  });

  it("exports core contracts with strict typing", () => {
    const options: PrintOptions = {
      copies: 1,
      cutAtEnd: true,
      compressRaster: true,
      colorMode: "mono"
    };

    const stubTransport: RuntimeTransport = {
      kind: "network",
      connect() {
        return Promise.resolve();
      },
      write() {
        return Promise.resolve();
      },
      read() {
        return Promise.resolve(new Uint8Array());
      },
      dispose() {
        return Promise.resolve();
      }
    };

    expect(options.colorMode).toBe("mono");
    expect(stubTransport.kind).toBe("network");
  });
});
