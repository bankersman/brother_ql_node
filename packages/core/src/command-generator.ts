import type { CommandBuffer, PrintOptions } from "./contracts.js";
import {
  validateModelLabelCompatibility,
  validateTwoColorSupport
} from "./registry.js";

export interface CommandGenerationRequest {
  model: string;
  label: string;
  imageBytes: Uint8Array;
  options?: PrintOptions;
}

export function generateBaselineCommand(
  request: CommandGenerationRequest
): CommandBuffer {
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
  const chunks: number[] = [0x1b, 0x40]; // initialize

  if (options.compressRaster) {
    chunks.push(0x4d, 0x02);
  } else {
    chunks.push(0x4d, 0x00);
  }

  if (options.rotate180) {
    chunks.push(0x69, 0x41, 0x01);
  }

  chunks.push(0x69, 0x4d, options.cutAtEnd === false ? 0x00 : 0x40);

  if (options.highQuality) {
    chunks.push(0x69, 0x7a, 0x01);
  }

  if (options.dither) {
    chunks.push(0x69, 0x64, 0x01);
  }

  if (typeof options.threshold === "number") {
    if (options.threshold < 0 || options.threshold > 100) {
      throw new Error("Threshold must be between 0 and 100.");
    }
    chunks.push(0x69, 0x74, options.threshold);
  }

  if (options.colorMode === "red-black") {
    chunks.push(0x69, 0x52, 0x01);
  }

  // Minimal baseline payload marker for MVP. Real rasterization comes later.
  chunks.push(0x67, request.imageBytes.length > 0 ? 0x01 : 0x00);

  return {
    bytes: new Uint8Array(chunks)
  };
}
