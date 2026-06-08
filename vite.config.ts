// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isVercel = process.env.VERCEL === "1" || process.env.NITRO_PRESET === "vercel";

export default defineConfig({
  // Force-enable nitro outside the Lovable sandbox (needed on Vercel CI).
  nitro: isVercel
    ? {
        preset: "vercel",
        // Vercel expects the Build Output API at .vercel/output
        output: {
          dir: ".vercel/output",
          serverDir: ".vercel/output/functions/__server.func",
          publicDir: ".vercel/output/static",
        },
      }
    : true,
  tanstackStart: {
    server: { entry: "server" },
  },
});
