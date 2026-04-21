import models from "./data/models.json" with { type: "json" };
import labels from "./data/labels.json" with { type: "json" };

export interface ModelDefinition {
  identifier: string;
  min_max_length_dots: [number, number];
  min_max_feed: [number, number];
  number_bytes_per_row: number;
  additional_offset_r: number;
  mode_setting: boolean;
  cutting: boolean;
  expanded_mode: boolean;
  compression: boolean;
  two_color: boolean;
  num_invalidate_bytes: number;
}

export type LabelFormFactor =
  | "ENDLESS"
  | "DIE_CUT"
  | "ROUND_DIE_CUT"
  | "PTOUCH_ENDLESS";

export type LabelColor = "BLACK_WHITE" | "BLACK_RED_WHITE";

export interface LabelDefinition {
  identifier: string;
  tape_size: [number, number];
  form_factor: LabelFormFactor;
  dots_total: [number, number];
  dots_printable: [number, number];
  offset_r: number;
  feed_margin: number;
  restricted_to_models: string[];
  color: LabelColor;
}

const modelMap = new Map(
  (models as ModelDefinition[]).map((model) => [model.identifier, model])
);
const labelMap = new Map(
  (labels as LabelDefinition[]).map((label) => [label.identifier, label])
);

export function listModels(): ModelDefinition[] {
  return [...modelMap.values()];
}

export function listLabels(): LabelDefinition[] {
  return [...labelMap.values()];
}

export function getModel(identifier: string): ModelDefinition {
  const model = modelMap.get(identifier);
  if (!model) {
    throw new Error(`Unknown model: ${identifier}`);
  }
  return model;
}

export function getLabel(identifier: string): LabelDefinition {
  const label = labelMap.get(identifier);
  if (!label) {
    throw new Error(`Unknown label: ${identifier}`);
  }
  return label;
}

export function validateModelLabelCompatibility(
  modelIdentifier: string,
  labelIdentifier: string
): void {
  const model = getModel(modelIdentifier);
  const label = getLabel(labelIdentifier);
  void model;

  if (
    label.restricted_to_models.length > 0 &&
    !label.restricted_to_models.includes(modelIdentifier)
  ) {
    throw new Error(
      `Label ${labelIdentifier} is not supported on model ${modelIdentifier}.`
    );
  }
}

export function validateTwoColorSupport(
  modelIdentifier: string,
  labelIdentifier: string
): void {
  const model = getModel(modelIdentifier);
  const label = getLabel(labelIdentifier);

  if (label.color === "BLACK_RED_WHITE" && !model.two_color) {
    throw new Error(
      `Label ${labelIdentifier} requires two-color support on model ${modelIdentifier}.`
    );
  }
}
