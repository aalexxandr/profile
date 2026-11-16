import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// `next build` with `output: "standalone"` leaves `public` and `.next/static`
// out of `.next/standalone`; the standalone server expects them beside it.
export const prepareStandalone = (root: string) => {
  const standalone = join(root, ".next", "standalone");

  if (!existsSync(join(standalone, "server.js"))) {
    throw new Error(
      `Standalone server not found in ${standalone}. Run \`pnpm build\` first.`,
    );
  }

  const assets = [
    [join(root, "public"), join(standalone, "public")],
    [join(root, ".next", "static"), join(standalone, ".next", "static")],
  ] as const;

  for (const [from, to] of assets) {
    rmSync(to, { recursive: true, force: true });
    cpSync(from, to, { recursive: true });
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  prepareStandalone(process.cwd());
}
