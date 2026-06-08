// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Force-enable the nitro deploy plugin during build (it would otherwise be skipped
// outside the Lovable sandbox). NITRO_PRESET env var picks the target (e.g. "vercel").
export default defineConfig({
  nitro: true,
  tanstackStart: {
    server: { entry: "server" },
  },
});
