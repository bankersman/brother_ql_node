import { describe, expect, it } from "vitest";

import { UsbTransport } from "./usb-transport.js";

describe("usb transport", () => {
  it("lists devices through adapter", async () => {
    const transport = new UsbTransport({
      listDevices: () =>
        Promise.resolve([{ vendorId: 0x04f9, productId: 0x209b }])
    });

    const devices = await transport.listDevices();
    expect(devices).toHaveLength(1);
    expect(devices[0]?.vendorId).toBe(0x04f9);
  });
});
