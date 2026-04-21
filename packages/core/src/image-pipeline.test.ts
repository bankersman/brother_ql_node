import { describe, expect, it } from "vitest";

import {
  applyGeometryRules,
  normalizeRgbaImage,
  toMonoRaster,
  toTwoColorRaster
} from "./image-pipeline.js";

function solidRgba(
  width: number,
  height: number,
  r: number,
  g: number,
  b: number,
  a = 255
): Uint8Array {
  const rgba = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    const idx = i * 4;
    rgba[idx] = r;
    rgba[idx + 1] = g;
    rgba[idx + 2] = b;
    rgba[idx + 3] = a;
  }
  return rgba;
}

describe("image pipeline", () => {
  it("composites alpha over white", () => {
    const normalized = normalizeRgbaImage({
      width: 1,
      height: 1,
      rgba: new Uint8Array([0, 0, 0, 0])
    });
    expect(Array.from(normalized.rgba)).toEqual([255, 255, 255, 255]);
  });

  it("applies endless geometry resizing and 600dpi width halving", () => {
    const image = {
      width: 200,
      height: 100,
      rgba: solidRgba(200, 100, 10, 10, 10)
    };
    const transformed = applyGeometryRules(image, {
      model: "QL-710W",
      label: "62",
      dpi600: true
    });
    expect(transformed.width).toBe(696);
  });

  it("converts to mono bits and two-color masks", () => {
    const image = {
      width: 2,
      height: 1,
      rgba: new Uint8Array([255, 0, 0, 255, 10, 10, 10, 255])
    };

    const mono = toMonoRaster(image, { thresholdPercent: 70 });
    expect(Array.from(mono.bits)).toEqual([1, 1]);

    const twoColor = toTwoColorRaster(image);
    expect(Array.from(twoColor.redBits)).toEqual([1, 0]);
    expect(Array.from(twoColor.blackBits)).toEqual([0, 1]);
  });
});
