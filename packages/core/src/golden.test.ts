import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { bytesToHex, hexToBytes, loadGoldenFixtures } from "./golden.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.resolve(
  __dirname,
  "../../../spec/upstream/golden-commands"
);

describe("golden fixture harness", () => {
  it("loads fixtures deterministically", async () => {
    const firstRead = await loadGoldenFixtures(fixturesDir);
    const secondRead = await loadGoldenFixtures(fixturesDir);

    expect(firstRead.map((fixture) => fixture.name)).toEqual(
      secondRead.map((fixture) => fixture.name)
    );
    expect(firstRead.length).toBeGreaterThan(0);
  });

  it("supports parity byte/hex conversions", async () => {
    const fixtures = await loadGoldenFixtures(fixturesDir);
    const monoFixture = fixtures[0];
    expect(monoFixture).toBeDefined();
    if (!monoFixture) {
      return;
    }

    const bytes = hexToBytes(monoFixture.instruction_hex);
    expect(bytesToHex(bytes)).toBe(monoFixture.instruction_hex);
  });
});
