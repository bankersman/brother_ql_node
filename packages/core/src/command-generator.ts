import type { CommandBuffer, PrintOptions } from "./contracts.js";
import {
  applyGeometryRules,
  toMonoRaster,
  toTwoColorRaster,
  type RasterImage
} from "./image-pipeline.js";
import { getModel } from "./registry.js";
import {
  validateModelLabelCompatibility,
  validateTwoColorSupport
} from "./registry.js";

export interface CommandGenerationRequest {
  model: string;
  label: string;
  imageBytes: Uint8Array;
  image?: RasterImage;
  options?: PrintOptions;
}

function packRowBits(bits: Uint8Array): Uint8Array {
  const rowBytes = Math.ceil(bits.length / 8);
  const packed = new Uint8Array(rowBytes);
  for (let x = 0; x < bits.length; x += 1) {
    if (bits[x] === 1) {
      const byteIndex = Math.floor(x / 8);
      const bitIndex = 7 - (x % 8);
      packed[byteIndex] = packed[byteIndex]! | (1 << bitIndex);
    }
  }
  return packed;
}

function defaultRasterImage(request: CommandGenerationRequest): RasterImage {
  if (request.image) {
    return request.image;
  }
  const width = 8;
  const height = Math.max(1, Math.ceil(request.imageBytes.length / width));
  const rgba = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    const value = request.imageBytes[i] ?? 255;
    const idx = i * 4;
    rgba[idx] = value;
    rgba[idx + 1] = value;
    rgba[idx + 2] = value;
    rgba[idx + 3] = 255;
  }
  return { width, height, rgba };
}

export function generateBaselineCommand(request: CommandGenerationRequest): CommandBuffer {
  if (!request.model.trim()) {
    throw new Error("Model is required.");
  }
  if (!request.label.trim()) {
    throw new Error("Label is required.");
  }
  validateModelLabelCompatibility(request.model, request.label);
  if (request.options?.colorMode === "red-black") {
    validateTwoColorSupport(request.model, request.label);
  }

  const options = request.options ?? {};
  const model = getModel(request.model);
  const geometryRequest: {
    model: string;
    label: string;
    dpi600?: boolean;
    rotate?: "auto" | 0 | 90 | 180 | 270;
  } = {
    model: request.model,
    label: request.label
  };
  if (options.highQuality !== undefined) {
    geometryRequest.dpi600 = options.highQuality;
  }
  geometryRequest.rotate = options.rotate180 ? 180 : "auto";
  const image = applyGeometryRules(defaultRasterImage(request), geometryRequest);
  const monoOptions: { thresholdPercent?: number; dither?: boolean } = {};
  if (options.threshold !== undefined) {
    monoOptions.thresholdPercent = options.threshold;
  }
  if (options.dither !== undefined) {
    monoOptions.dither = options.dither;
  }
  const monoRaster = toMonoRaster(image, monoOptions);
  const twoColorRaster =
    options.colorMode === "red-black" ? toTwoColorRaster(image) : undefined;

  const chunks: number[] = [];
  for (let i = 0; i < model.num_invalidate_bytes; i += 1) {
    chunks.push(0x00);
  }
  chunks.push(0x1b, 0x40); // initialize
  chunks.push(0x1b, 0x69, 0x53); // status information request

  if (options.compressRaster && model.compression) {
    chunks.push(0x4d, 0x02);
  } else {
    chunks.push(0x4d, 0x00);
  }

  if (options.rotate180) {
    chunks.push(0x69, 0x41, 0x01);
  }

  chunks.push(0x69, 0x4d, options.cutAtEnd === false ? 0x00 : 0x40);

  chunks.push(
    0x1b,
    0x69,
    0x7a,
    0x84,
    0x00,
    monoRaster.width & 0xff,
    (monoRaster.width >> 8) & 0xff,
    monoRaster.height & 0xff,
    (monoRaster.height >> 8) & 0xff,
    0x00,
    0x00
  );

  if (typeof options.threshold === "number") {
    if (options.threshold < 0 || options.threshold > 100) {
      throw new Error("Threshold must be between 0 and 100.");
    }
    chunks.push(0x69, 0x74, options.threshold);
  }

  if (options.colorMode === "red-black") {
    chunks.push(0x69, 0x52, 0x01);
  }

  const rowBytes = model.number_bytes_per_row;
  for (let y = 0; y < monoRaster.height; y += 1) {
    const rowBits = monoRaster.bits.subarray(
      y * monoRaster.width,
      (y + 1) * monoRaster.width
    );
    const packedRow = packRowBits(rowBits);
    const row = new Uint8Array(rowBytes);
    row.set(packedRow.subarray(0, Math.min(packedRow.length, rowBytes)));

    if (twoColorRaster) {
      const redBits = twoColorRaster.redBits.subarray(
        y * twoColorRaster.width,
        (y + 1) * twoColorRaster.width
      );
      const blackBits = twoColorRaster.blackBits.subarray(
        y * twoColorRaster.width,
        (y + 1) * twoColorRaster.width
      );
      const packedBlack = packRowBits(blackBits);
      const packedRed = packRowBits(redBits);
      const blackRow = new Uint8Array(rowBytes);
      blackRow.set(packedBlack.subarray(0, Math.min(packedBlack.length, rowBytes)));
      const redRow = new Uint8Array(rowBytes);
      redRow.set(packedRed.subarray(0, Math.min(packedRed.length, rowBytes)));
      chunks.push(0x77, 0x01, rowBytes & 0xff, (rowBytes >> 8) & 0xff, ...blackRow);
      chunks.push(0x77, 0x02, rowBytes & 0xff, (rowBytes >> 8) & 0xff, ...redRow);
    } else {
      chunks.push(0x67, 0x00, rowBytes & 0xff, (rowBytes >> 8) & 0xff, ...row);
    }
  }

  chunks.push(0x1a);

  return {
    bytes: new Uint8Array(chunks)
  };
}
