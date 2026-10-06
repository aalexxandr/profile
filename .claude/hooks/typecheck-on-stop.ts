// Stop hook: blocks the stop if the project does not type-check.
// stop_hook_active guards against an infinite loop.

const input = (await Bun.stdin.json()) as { stop_hook_active?: boolean };
if (input.stop_hook_active) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const proc = Bun.spawn(["bun", "run", "typecheck"], {
  cwd: root,
  stdout: "pipe",
  stderr: "pipe",
});
const [stdout, stderr] = await Promise.all([
  new Response(proc.stdout).text(),
  new Response(proc.stderr).text(),
]);

if ((await proc.exited) !== 0) {
  console.error(stdout + stderr);
  process.exit(2);
}
