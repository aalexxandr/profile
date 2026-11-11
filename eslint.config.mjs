import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier/flat";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    ...betterTailwindcss.configs["recommended"],
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/app/globals.css",
      },
    },
    rules: {
      ...betterTailwindcss.configs["recommended"].rules,
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "no-console": ["error", { allow: ["warn", "error"] }],
      // One component per file: helpers, types and subcomponents go to their own
      // files (see "Code conventions" in CLAUDE.md).
      "react/no-multi-comp": "warn",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../../*"],
              message: "Use the @/ alias instead of deep relative imports.",
            },
          ],
        },
      ],
    },
  },
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated from the backend OpenAPI document (`pnpm api:generate`).
    "src/shared/api/generated/**",
    // Generated reports.
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
