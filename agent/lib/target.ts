import { homedir } from "node:os";
import { basename, resolve } from "node:path";

// The squad runs as a sidecar: it works on a project in another folder, set in .env.local.
const expand = (path: string) => resolve(path.replace(/^~(?=$|\/)/, homedir()));

/** Absolute host path of the project being built, mounted at /workspace/app. */
export const targetDir = process.env.SQUAD_TARGET ? expand(process.env.SQUAD_TARGET) : undefined;

/** Project name shown to the agents; defaults to the target folder's name. */
export const projectName = process.env.SQUAD_PROJECT ?? (targetDir ? basename(targetDir) : "default");

/** Host path for workflow artifacts; defaults to <target>/.squad so they are versioned with the project. */
export const artifactsDir = process.env.SQUAD_ARTIFACTS
  ? expand(process.env.SQUAD_ARTIFACTS)
  : targetDir && `${targetDir}/.squad`;

/** GitHub repository (owner/repo) where tickets become issues. Unset keeps tickets local. */
export const githubRepo = process.env.SQUAD_GITHUB_REPO;

/** Optional GitHub Projects board number that issues are added to. */
export const githubProject = process.env.SQUAD_GITHUB_PROJECT;

/** Personal access token for the GitHub MCP server. */
export const githubToken = process.env.GITHUB_TOKEN;

export const githubEnabled = Boolean(githubRepo && githubToken);
