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

export default defineConfig({
  plugins: [svgrStub(), react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
