import { defineConfig } from "vite";

function resolveBase(): string {
  const raw = process.env.DEMO_BASE ?? process.env.VITE_BASE;
  if (!raw || raw === "/") {
    return "/";
  }
  return raw.endsWith("/") ? raw : `${raw}/`;
}

export default defineConfig({
  base: resolveBase(),
  build: {
    outDir: "dist",
    emptyOutDir: true
  },
  server: {
    port: 5173
  }
});
