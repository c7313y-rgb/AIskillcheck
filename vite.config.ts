/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/AI-skillcheck/",
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules/react") || id.includes("node_modules/scheduler")) {
            return "react-vendor";
          }
          return undefined;
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: true,
  },
});
