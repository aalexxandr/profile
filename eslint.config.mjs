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
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
