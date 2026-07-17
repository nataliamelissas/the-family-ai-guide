/// <reference types="vitest/config" />
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * `base` controls the public path the site is served from. CI sets this from
 * the Pages configuration, so it adapts to a project path today and a custom
 * domain later. Vite requires a trailing slash; the Pages action omits one.
 */
const RAW_BASE_PATH = process.env.VITE_BASE_PATH || "/";
const BASE_PATH = RAW_BASE_PATH.endsWith("/")
  ? RAW_BASE_PATH
  : `${RAW_BASE_PATH}/`;

export default defineConfig({
  base: BASE_PATH,
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    /*
     * Pinned to the audience's timezone so date assertions are deterministic
     * across machines and CI. A negative UTC offset also keeps the date-only
     * regression meaningful: naive parsing fails here, but passes under UTC.
     */
    env: { TZ: "America/Denver" },
  },
});
