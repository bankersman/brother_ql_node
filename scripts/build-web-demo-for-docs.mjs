import { spawnSync } from "node:child_process";
import { cp, mkdir, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Match docs/.vitepress/config.ts `resolveBase()` plus a fixed `web-demo/` segment
 * so Vite asset URLs align with the deployed VitePress site.
 */
function resolveDemoBase() {
  const repo = process.env.GITHUB_REPOSITORY;
  if (!repo) {
    return "/web-demo/";
  }
  const [, name] = repo.split("/");
  if (!name) {
    return "/web-demo/";
  }
  return `/${name}/web-demo/`;
}

function run(cmd, args, env = {}) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: "inherit",
    shell: false,
    env: { ...process.env, ...env }
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const demoBase = resolveDemoBase();

run("pnpm", ["--filter", "@brother-ql/web-demo...", "run", "build"], {
  DEMO_BASE: demoBase
});

const src = join(root, "packages", "web", "demo", "dist");
/** With `srcDir: "src"`, VitePress resolves `public` under `docs/src/public/`. */
const dest = join(root, "docs", "src", "public", "web-demo");

await rm(dest, { recursive: true, force: true });
await mkdir(join(root, "docs", "src", "public"), { recursive: true });
await cp(src, dest, { recursive: true });

console.log(
  `Synced web demo (${demoBase}) to docs/src/public/web-demo for VitePress.`
);
