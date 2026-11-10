// PostToolUse hook: formats and lints the file Claude just edited.
// Exit code 2 sends remaining ESLint errors back to Claude via stderr.

import { readStdinJson, run } from "./run.mjs";

const FORMATTABLE = /\.(ts|tsx|mjs|css|json|md)$/;
const LINTABLE = /\.(ts|tsx|mjs)$/;

const main = async () => {
  const input = await readStdinJson<{ tool_input?: { file_path?: string } }>();
  const filePath = input.tool_input?.file_path;

  if (!filePath || !FORMATTABLE.test(filePath)) return;

  const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  if (!filePath.startsWith(root) || filePath.includes("/node_modules/")) {
    return;
  }

  await run(
    "pnpm",
    ["exec", "prettier", "--write", "--ignore-unknown", filePath],
    root,
  );

  if (LINTABLE.test(filePath)) {
    const { code, output } = await run(
      "pnpm",
      ["exec", "eslint", "--fix", filePath],
      root,
    );
    if (code !== 0) {
      console.error(output);
      process.exit(2);
    }
  }
};

await main();
