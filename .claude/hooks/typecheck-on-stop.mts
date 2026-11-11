// Stop hook: blocks the stop if the project does not type-check.
// stop_hook_active guards against an infinite loop.

import { readStdinJson, run } from "./run.mjs";

const main = async () => {
  const input = await readStdinJson<{ stop_hook_active?: boolean }>();
  if (input.stop_hook_active) return;

  const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const { code, output } = await run("pnpm", ["typecheck"], root);

  if (code !== 0) {
    console.error(output);
    process.exit(2);
  }
};

await main();
