import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: resolve(rootDir, "ios-web"),
  base: "./",
  publicDir: resolve(rootDir, "public"),
  plugins: [react()],
  build: {
    emptyOutDir: true,
    outDir: resolve(rootDir, "dist-ios"),
  },
});
