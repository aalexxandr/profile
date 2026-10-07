import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vitest/config";

const SVGR_QUERY_PATTERN = /\.svg\?svgr$/;

// `?svgr` imports are converted by @svgr/webpack in Next. Tests replace them
// with a plain <svg> so components importing icons render without a loader.
const svgrStub = (): Plugin => ({
  name: "svgr-stub",
  enforce: "pre",
  load(id) {
    if (!SVGR_QUERY_PATTERN.test(id)) {
      return null;
    }

    return `
      import { createElement } from "react";
      export default (props) => createElement("svg", props);
    `;
  },
});

// `server-only` only exists inside Next's bundler; resolve it to an empty module
// so server modules that import it can be tested.
const SERVER_ONLY_ID = "\0server-only-stub";
const serverOnlyStub = (): Plugin => ({
  name: "server-only-stub",
  enforce: "pre",
  resolveId(source) {
    return source === "server-only" ? SERVER_ONLY_ID : null;
  },
  load(id) {
    return id === SERVER_ONLY_ID ? "export {};" : null;
  },
});

export default defineConfig({
  plugins: [svgrStub(), serverOnlyStub(), react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      // Thin route/layout files only compose pages and are covered by E2E.
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/*.d.ts",
        "src/app/**/page.tsx",
        "src/app/**/layout.tsx",
        "src/app/_layout/**",
      ],
      reporter: ["text", "html", "json-summary"],
      // Keep the current level from regressing; raise them as coverage grows.
      thresholds: {
        branches: 75,
        functions: 75,
        lines: 80,
        statements: 80,
      },
    },
  },
});
