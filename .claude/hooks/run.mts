import { spawn } from "node:child_process";

export const readStdinJson = async <T,>(): Promise<T> => {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;
  return JSON.parse(data || "{}") as T;
};

export const run = (cmd: string, args: string[], cwd: string) =>
  new Promise<{ code: number; output: string }>((resolve) => {
    const proc = spawn(cmd, args, { cwd });
    let output = "";
    proc.stdout.on("data", (chunk) => (output += chunk));
    proc.stderr.on("data", (chunk) => (output += chunk));
    proc.on("error", (error) => resolve({ code: 1, output: String(error) }));
    proc.on("close", (code) => resolve({ code: code ?? 1, output }));
  });
