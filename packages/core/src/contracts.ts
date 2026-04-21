export type PrintColorMode = "mono" | "red-black";

export interface PrinterModel {
  id: string;
  name: string;
  maxPrintWidthDots: number;
  supportsTwoColor: boolean;
  supports600dpi: boolean;
}

export interface LabelMetadata {
  id: string;
  widthMm: number;
  lengthMm?: number;
  printableWidthDots: number;
}

export interface PrintOptions {
  copies?: number;
  cutAtEnd?: boolean;
  highQuality?: boolean;
  compressRaster?: boolean;
  rotate180?: boolean;
  threshold?: number;
  dither?: boolean;
  colorMode?: PrintColorMode;
}

export interface CommandBuffer {
  readonly bytes: Uint8Array;
}

export interface StatusFrame {
  phaseType: "waiting" | "printing" | "completed" | "error";
  statusType: "ok" | "cover-open" | "media-empty" | "generic-error";
  errorCode?: number;
  raw: Uint8Array;
}

export type TransportKind = "network" | "usb" | "webusb";

export interface TransportWriteRequest {
  data: Uint8Array;
  timeoutMs?: number;
}

export interface TransportReadRequest {
  size?: number;
  timeoutMs?: number;
}

export interface RuntimeTransport {
  readonly kind: TransportKind;
  connect(): Promise<void>;
  write(request: TransportWriteRequest): Promise<void>;
  read(request?: TransportReadRequest): Promise<Uint8Array>;
  dispose(): Promise<void>;
}
