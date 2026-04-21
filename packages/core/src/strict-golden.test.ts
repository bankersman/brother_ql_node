import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { generateBaselineCommand } from "./command-generator.js";

interface StrictGoldenFixture {
  name: string;
  model: string;
  label: string;
  image_bytes: number[];
  options: Record<string, unknown>;
  expected_sha256: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const strictFixturePaths = [
  path.resolve(
    __dirname,
    "../../../spec/upstream/golden-commands/strict-mono-ql710w.json"
  ),
  path.resolve(
    __dirname,
    "../../../spec/upstream/golden-commands/strict-red-ql820nwb.json"
  )
];

describe("strict golden parity", () => {
  it("matches full-stream hashes for strict fixture matrix", async () => {
    for (const fixturePath of strictFixturePaths) {
      const fixture = JSON.parse(
        await readFile(fixturePath, "utf8")
      ) as StrictGoldenFixture;
      const generated = generateBaselineCommand({
        model: fixture.model,
        label: fixture.label,
        imageBytes: new Uint8Array(fixture.image_bytes),
        options: fixture.options
      });
      const actualHash = createHash("sha256")
        .update(generated.bytes)
        .digest("hex");
      expect(actualHash, fixture.name).toBe(fixture.expected_sha256);
    }
  });
});
