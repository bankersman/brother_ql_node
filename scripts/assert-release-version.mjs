import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ref = process.env.GITHUB_REF_NAME;
if (!ref?.startsWith("v")) {
  console.error("GITHUB_REF_NAME must be set to a tag like v1.2.3");
  process.exit(1);
}

const expected = ref.slice(1);
const packagesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "packages"
);

for (const name of readdirSync(packagesDir)) {
  const pkgPath = join(packagesDir, name, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  if (pkg.private === true) {
    continue;
  }
  if (pkg.version !== expected) {
    console.error(
      `packages/${name}/package.json version "${pkg.version}" does not match tag "${expected}"`
    );
    process.exit(1);
  }
}

console.log(`Release version ${expected} matches all publishable packages.`);
