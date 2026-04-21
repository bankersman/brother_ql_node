import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export interface GoldenFixture {
  name: string;
  model: string;
  label: string;
  options: Record<string, unknown>;
  input_image: string;
  instruction_hex: string;
}

export async function loadGoldenFixtures(
  fixturesDir: string
): Promise<GoldenFixture[]> {
  const entries = await readdir(fixturesDir);
  const fixtureFiles = entries
    .filter((entry) => entry.endsWith(".json"))
    .sort();

  const fixtures = await Promise.all(
    fixtureFiles.map(async (fixtureFile) => {
      const fixturePath = path.join(fixturesDir, fixtureFile);
      const raw = await readFile(fixturePath, "utf8");
      return JSON.parse(raw) as GoldenFixture;
    })
  );

  return fixtures;
}

export function hexToBytes(hex: string): Uint8Array {
  const compactHex = hex.replace(/\s+/g, "").toLowerCase();
  if (compactHex.length % 2 !== 0) {
    throw new Error("Invalid hex string length.");
  }

  const bytes = new Uint8Array(compactHex.length / 2);
  for (let i = 0; i < compactHex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(compactHex.slice(i, i + 2), 16);
  }

  return bytes;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}
