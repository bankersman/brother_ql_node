import { getLabel, getModel } from "./registry.js";

export interface RasterImage {
  width: number;
  height: number;
  rgba: Uint8Array;
}

export interface GeometryRequest {
  model: string;
  label: string;
  dpi600?: boolean;
  rotate?: "auto" | 0 | 90 | 180 | 270;
}

export interface MonoRaster {
  width: number;
  height: number;
  bits: Uint8Array;
}

export interface TwoColorRaster {
  width: number;
  height: number;
  blackBits: Uint8Array;
  redBits: Uint8Array;
}

export function normalizeRgbaImage(image: RasterImage): RasterImage {
  const out = new Uint8Array(image.rgba.length);
  for (let i = 0; i < image.rgba.length; i += 4) {
    const alpha = image.rgba[i + 3]! / 255;
    out[i] = Math.round(image.rgba[i]! * alpha + 255 * (1 - alpha));
    out[i + 1] = Math.round(image.rgba[i + 1]! * alpha + 255 * (1 - alpha));
    out[i + 2] = Math.round(image.rgba[i + 2]! * alpha + 255 * (1 - alpha));
    out[i + 3] = 255;
  }
  return { ...image, rgba: out };
}

function rotateImage(image: RasterImage, rotate: 0 | 90 | 180 | 270): RasterImage {
  if (rotate === 0) {
    return image;
  }

  if (rotate === 180) {
    const out = new Uint8Array(image.rgba.length);
    for (let y = 0; y < image.height; y += 1) {
      for (let x = 0; x < image.width; x += 1) {
        const srcIndex = (y * image.width + x) * 4;
        const targetX = image.width - 1 - x;
        const targetY = image.height - 1 - y;
        const dstIndex = (targetY * image.width + targetX) * 4;
        out.set(image.rgba.subarray(srcIndex, srcIndex + 4), dstIndex);
      }
    }
    return { width: image.width, height: image.height, rgba: out };
  }

  const rotatedWidth = image.height;
  const rotatedHeight = image.width;
  const out = new Uint8Array(image.rgba.length);
  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const srcIndex = (y * image.width + x) * 4;
      const targetX = rotate === 90 ? image.height - 1 - y : y;
      const targetY = rotate === 90 ? x : image.width - 1 - x;
      const dstIndex = (targetY * rotatedWidth + targetX) * 4;
      out.set(image.rgba.subarray(srcIndex, srcIndex + 4), dstIndex);
    }
  }

  return { width: rotatedWidth, height: rotatedHeight, rgba: out };
}

function resizeNearest(image: RasterImage, width: number): RasterImage {
  if (image.width === width) {
    return image;
  }
  const height = Math.max(1, Math.round((image.height * width) / image.width));
  const out = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const srcX = Math.floor((x / width) * image.width);
      const srcY = Math.floor((y / height) * image.height);
      const srcIndex = (srcY * image.width + srcX) * 4;
      const dstIndex = (y * width + x) * 4;
      out.set(image.rgba.subarray(srcIndex, srcIndex + 4), dstIndex);
    }
  }

  return { width, height, rgba: out };
}

export function applyGeometryRules(
  image: RasterImage,
  request: GeometryRequest
): RasterImage {
  const model = getModel(request.model);
  const label = getLabel(request.label);
  let out = image;

  if (request.rotate && request.rotate !== "auto") {
    out = rotateImage(out, request.rotate);
  }

  if (
    request.rotate === "auto" &&
    label.form_factor !== "ENDLESS" &&
    label.form_factor !== "PTOUCH_ENDLESS"
  ) {
    const expectedWidth = label.dots_printable[0];
    const expectedHeight = label.dots_printable[1];
    if (out.width === expectedHeight && out.height === expectedWidth) {
      out = rotateImage(out, 90);
    } else if (out.width !== expectedWidth || out.height !== expectedHeight) {
      throw new Error(
        `Image dimensions ${out.width}x${out.height} do not match die-cut label ${request.label}.`
      );
    }
  }

  if (request.dpi600) {
    out = resizeNearest(out, Math.max(1, Math.floor(out.width / 2)));
  }

  const printableWidth = label.dots_printable[0];
  if (
    label.form_factor === "ENDLESS" ||
    label.form_factor === "PTOUCH_ENDLESS"
  ) {
    out = resizeNearest(out, printableWidth);
  }

  const finalWidth = model.number_bytes_per_row * 8;
  if (out.width > finalWidth) {
    out = resizeNearest(out, finalWidth);
  }
  return out;
}

function toLuminance(r: number, g: number, b: number): number {
  return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}

export function toMonoRaster(
  image: RasterImage,
  opts: { thresholdPercent?: number; dither?: boolean } = {}
): MonoRaster {
  const thresholdPercent = opts.thresholdPercent ?? 70;
  const cutoff = Math.round(((100 - thresholdPercent) / 100) * 255);
  const bits = new Uint8Array(image.width * image.height);

  const luma = new Float32Array(image.width * image.height);
  for (let i = 0; i < image.width * image.height; i += 1) {
    const idx = i * 4;
    luma[i] =
      255 -
      toLuminance(image.rgba[idx]!, image.rgba[idx + 1]!, image.rgba[idx + 2]!);
  }

  if (opts.dither) {
    for (let y = 0; y < image.height; y += 1) {
      for (let x = 0; x < image.width; x += 1) {
        const i = y * image.width + x;
        const old = luma[i]!;
        const next = old > cutoff ? 255 : 0;
        bits[i] = next > 0 ? 1 : 0;
        const error = old - next;
        if (x + 1 < image.width) luma[i + 1]! += (error * 7) / 16;
        if (y + 1 < image.height) {
          if (x > 0) luma[i + image.width - 1]! += (error * 3) / 16;
          luma[i + image.width]! += (error * 5) / 16;
          if (x + 1 < image.width) luma[i + image.width + 1]! += error / 16;
        }
      }
    }
  } else {
    for (let i = 0; i < luma.length; i += 1) {
      bits[i] = luma[i]! > cutoff ? 1 : 0;
    }
  }

  return { width: image.width, height: image.height, bits };
}

export function toTwoColorRaster(image: RasterImage): TwoColorRaster {
  const redBits = new Uint8Array(image.width * image.height);
  const blackBits = new Uint8Array(image.width * image.height);

  for (let i = 0; i < image.width * image.height; i += 1) {
    const idx = i * 4;
    const r = image.rgba[idx]!;
    const g = image.rgba[idx + 1]!;
    const b = image.rgba[idx + 2]!;

    const redDominant = r > 120 && r > g * 1.15 && r > b * 1.15;
    if (redDominant) {
      redBits[i] = 1;
      blackBits[i] = 0;
      continue;
    }

    const luma = toLuminance(r, g, b);
    blackBits[i] = luma < 140 ? 1 : 0;
  }

  return { width: image.width, height: image.height, blackBits, redBits };
}
