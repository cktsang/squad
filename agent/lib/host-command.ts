import { spawn } from "node:child_process";
import { relative, resolve } from "node:path";
import { defineCommand } from "just-bash";

const APP_MOUNT = "/workspace/app";
const MAX_OUTPUT = 200_000;
const TIMEOUT_MS = 15 * 60 * 1000;
// Keep the squad's own credentials away from commands it runs in the target project.
const SECRET_ENV = /TOKEN|SECRET|PASSWORD|API_KEY|OIDC/i;

const clip = (text: string) =>
  text.length > MAX_OUTPUT ? `${text.slice(0, MAX_OUTPUT)}\n[output truncated]` : text;

/**
 * `host <command> [args...]` runs a real program on this machine inside the target project,
 * for what the virtual shell cannot do: npm, node, tsc, git, test runners, and so on.
 * The working directory follows the shell's cwd when it is inside /workspace/app.
 */
export function hostCommand(targetDir: string | undefined) {
  return defineCommand(
    "host",
    async (args, ctx) => {
      if (!targetDir) {
        return { stdout: "", stderr: "host: SQUAD_TARGET is not set in .env.local\n", exitCode: 2 };
      }
      if (args.length === 0) {
        return { stdout: "", stderr: "usage: host <command> [args...]\n", exitCode: 2 };
      }

      const inside = relative(APP_MOUNT, ctx.cwd);
      const cwd = inside.startsWith("..") ? targetDir : resolve(targetDir, inside);
      const env = Object.fromEntries(
        Object.entries(process.env).filter(([key]) => !SECRET_ENV.test(key)),
      );

      return new Promise((done) => {
        const child = spawn(args[0]!, args.slice(1), {
          cwd,
          env: { ...env, CI: "1", FORCE_COLOR: "0" },
          signal: ctx.signal,
          timeout: TIMEOUT_MS,
        });
        let stdout = "";
        let stderr = "";
        child.stdout.on("data", (chunk) => (stdout += chunk));
        child.stderr.on("data", (chunk) => (stderr += chunk));
        if (ctx.stdin) child.stdin.end(ctx.stdin);
        else child.stdin.end();
        child.on("error", (error) =>
          done({ stdout: clip(stdout), stderr: clip(`${stderr}host: ${error.message}\n`), exitCode: 127 }),
        );
        child.on("close", (code) =>
          done({ stdout: clip(stdout), stderr: clip(stderr), exitCode: code ?? 1 }),
        );
      });
    },
    { trusted: true },
  );
}
