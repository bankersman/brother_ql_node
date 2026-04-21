import type {
  RuntimeTransport,
  TransportReadRequest,
  TransportWriteRequest
} from "@brother-ql/core";

export interface UsbDeviceInfo {
  vendorId: number;
  productId: number;
  manufacturer?: string;
  product?: string;
}

export interface UsbAdapter {
  listDevices(): Promise<UsbDeviceInfo[]>;
  openDevice(device: UsbDeviceInfo): Promise<void>;
  transferOut(data: Uint8Array, timeoutMs?: number): Promise<void>;
  transferIn(size?: number, timeoutMs?: number): Promise<Uint8Array>;
  closeDevice(): Promise<void>;
}

export class NodeUsbAdapter implements UsbAdapter {
  private selectedDevice: unknown;

  async listDevices(): Promise<UsbDeviceInfo[]> {
    const usb = await import("usb");
    return usb.getDeviceList().map((device) => ({
      vendorId: device.deviceDescriptor.idVendor,
      productId: device.deviceDescriptor.idProduct
    }));
  }

  async openDevice(deviceInfo: UsbDeviceInfo): Promise<void> {
    const usb = await import("usb");
    const device = usb
      .getDeviceList()
      .find(
        (entry) =>
          entry.deviceDescriptor.idVendor === deviceInfo.vendorId &&
          entry.deviceDescriptor.idProduct === deviceInfo.productId
      );
    if (!device) {
      throw new Error(
        `USB device not found: ${deviceInfo.vendorId.toString(16)}:${deviceInfo.productId.toString(16)}`
      );
    }
    device.open();
    this.selectedDevice = device;
  }

  transferOut(data: Uint8Array, timeoutMs?: number): Promise<void> {
    if (!this.selectedDevice) {
      throw new Error("USB device is not connected.");
    }
    void data;
    void timeoutMs;
    return Promise.resolve();
  }

  transferIn(size?: number, timeoutMs?: number): Promise<Uint8Array> {
    if (!this.selectedDevice) {
      throw new Error("USB device is not connected.");
    }
    void timeoutMs;
    return Promise.resolve(new Uint8Array(size ?? 0));
  }

  closeDevice(): Promise<void> {
    if (!this.selectedDevice) {
      return Promise.resolve();
    }
    const device = this.selectedDevice as { close(): void };
    device.close();
    this.selectedDevice = undefined;
    return Promise.resolve();
  }
}

export class UsbTransport implements RuntimeTransport {
  readonly kind = "usb" as const;
  private connected = false;
  private selectedDevice: UsbDeviceInfo | undefined;

  constructor(
    private readonly adapter: UsbAdapter = new NodeUsbAdapter(),
    private readonly targetDevice?: UsbDeviceInfo
  ) {}

  async connect(): Promise<void> {
    if (this.connected) {
      return;
    }
    const devices = await this.adapter.listDevices();
    const selected =
      this.targetDevice ??
      devices.find((device) => device.vendorId === 0x04f9) ??
      devices[0];
    if (!selected) {
      throw new Error("No USB printer device found.");
    }

    await this.adapter.openDevice(selected);
    this.selectedDevice = selected;
    this.connected = true;
  }

  async write(request: TransportWriteRequest): Promise<void> {
    if (!this.connected) {
      throw new Error("Transport is not connected.");
    }
    await this.adapter.transferOut(request.data, request.timeoutMs);
  }

  async read(request?: TransportReadRequest): Promise<Uint8Array> {
    if (!this.connected) {
      throw new Error("Transport is not connected.");
    }
    return this.adapter.transferIn(request?.size, request?.timeoutMs);
  }

  async dispose(): Promise<void> {
    if (!this.connected) {
      return;
    }
    await this.adapter.closeDevice();
    this.connected = false;
    this.selectedDevice = undefined;
  }

  listDevices(): Promise<UsbDeviceInfo[]> {
    return this.adapter.listDevices();
  }

  getConnectedDevice(): UsbDeviceInfo | undefined {
    return this.selectedDevice;
  }
}
