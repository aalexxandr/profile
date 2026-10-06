// PostToolUse hook: formats and lints the file Claude just edited.
// Exit code 2 sends remaining ESLint errors back to Claude via stderr.

const FORMATTABLE = /\.(ts|tsx|mjs|css|json|md)$/;
const LINTABLE = /\.(ts|tsx|mjs)$/;

const input = (await Bun.stdin.json()) as {
  tool_input?: { file_path?: string };
};
const filePath = input.tool_input?.file_path;

if (!filePath || !FORMATTABLE.test(filePath)) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
if (!filePath.startsWith(root) || filePath.includes("/node_modules/")) {
  process.exit(0);
}

const run = async (cmd: string[]) => {
  const proc = Bun.spawn(cmd, { cwd: root, stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ]);
  return { code: await proc.exited, output: stdout + stderr };
};

await run(["bunx", "prettier", "--write", "--ignore-unknown", filePath]);

if (LINTABLE.test(filePath)) {
  const { code, output } = await run(["bunx", "eslint", "--fix", filePath]);
  if (code !== 0) {
    console.error(output);
    process.exit(2);
  }
}
