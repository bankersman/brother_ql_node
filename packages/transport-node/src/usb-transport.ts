import type {
  RuntimeTransport,
  TransportReadRequest,
  TransportWriteRequest
} from "../../core/src/index.js";

export interface UsbDeviceInfo {
  vendorId: number;
  productId: number;
  manufacturer?: string;
  product?: string;
}

export interface UsbAdapter {
  listDevices(): Promise<UsbDeviceInfo[]>;
}

export class NodeUsbAdapter implements UsbAdapter {
  async listDevices(): Promise<UsbDeviceInfo[]> {
    const usb = await import("usb");
    return usb.getDeviceList().map((device) => ({
      vendorId: device.deviceDescriptor.idVendor,
      productId: device.deviceDescriptor.idProduct
    }));
  }
}

export class UsbTransport implements RuntimeTransport {
  readonly kind = "usb" as const;
  constructor(private readonly adapter: UsbAdapter = new NodeUsbAdapter()) {}

  connect(): Promise<void> {
    return Promise.resolve();
  }

  write(request: TransportWriteRequest): Promise<void> {
    void request;
    return Promise.resolve();
  }

  read(request?: TransportReadRequest): Promise<Uint8Array> {
    void request;
    return Promise.resolve(new Uint8Array());
  }

  dispose(): Promise<void> {
    return Promise.resolve();
  }

  listDevices(): Promise<UsbDeviceInfo[]> {
    return this.adapter.listDevices();
  }
}
