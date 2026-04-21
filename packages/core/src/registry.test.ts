import { describe, expect, it } from "vitest";

import {
  getLabel,
  getModel,
  listLabels,
  listModels,
  validateModelLabelCompatibility,
  validateTwoColorSupport
} from "./registry.js";

describe("model and label registry", () => {
  it("lists and resolves known model and label entries", () => {
    expect(listModels().length).toBeGreaterThan(0);
    expect(listLabels().length).toBeGreaterThan(0);
    expect(getModel("QL-710W").identifier).toBe("QL-710W");
    expect(getLabel("62").identifier).toBe("62");
  });

  it("validates restricted model compatibility", () => {
    expect(() => validateModelLabelCompatibility("QL-710W", "102")).toThrowError(
      "Label 102 is not supported on model QL-710W."
    );
    expect(() =>
      validateModelLabelCompatibility("QL-1100", "102")
    ).not.toThrow();
  });

  it("validates two-color label requirements", () => {
    expect(() => validateTwoColorSupport("QL-710W", "62red")).toThrowError(
      "Label 62red requires two-color support on model QL-710W."
    );
    expect(() => validateTwoColorSupport("QL-820NWB", "62red")).not.toThrow();
  });
});
