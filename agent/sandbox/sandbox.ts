import { mkdirSync } from "node:fs";
import { defineSandbox } from "eve/sandbox";
import { JustBashSandbox } from "eve/sandbox/just-bash";
import { hostCommand } from "#lib/host-command.js";
import {
  artifactsDir,
  githubEnabled,
  githubProject,
  githubRepo,
  projectName,
  targetDir,
} from "#lib/target.js";

const SEEDS = ["definition-of-ready.md", "definition-of-done.md", "board.md"];
// Workspace seeds skip dotfiles, so the artifacts .gitignore is written here.
const GITIGNORE = [
  "# Regenerated per ticket; the brief, spec, architecture, ADRs, tickets, and retros are worth committing.",
  "context/",
  "reports/",
  "config.md",
  "",
].join("\n");

// Sidecar layout: this repo holds the agent; the target project folder is mounted read-write at
// /workspace/app, and the artifacts folder (<target>/.squad by default) at /workspace/.squad.
export const environment = JustBashSandbox.environment({
  customCommands: [hostCommand(targetDir)],
  async filesystem({ defaultFilesystem, justBash }) {
    if (!targetDir || !artifactsDir) return defaultFilesystem;

    mkdirSync(targetDir, { recursive: true });
    mkdirSync(artifactsDir, { recursive: true });

    const app = new justBash.ReadWriteFs({ root: targetDir });
    const squad = new justBash.ReadWriteFs({ root: artifactsDir });

    for (const file of SEEDS) {
      const seed = `/workspace/.squad/${file}`;
      if (!(await squad.exists(`/${file}`)) && (await defaultFilesystem.exists(seed))) {
        await squad.writeFile(`/${file}`, await defaultFilesystem.readFile(seed));
      }
    }

    if (!(await squad.exists("/.gitignore"))) await squad.writeFile("/.gitignore", GITIGNORE);

    await squad.writeFile(
      "/config.md",
      [
        "# Squad config (written by the sandbox on open; do not edit)",
        "",
        `- Project: ${projectName}`,
        `- Code: /workspace/app (host folder ${targetDir})`,
        `- Tickets: ${githubEnabled ? `GitHub issues in ${githubRepo}` : "local files only (.squad/tickets/, .squad/board.md)"}`,
        `- GitHub Project board: ${githubEnabled && githubProject ? `#${githubProject} owned by ${githubRepo!.split("/")[0]}` : "none"}`,
        "",
      ].join("\n"),
    );

    return new justBash.MountableFs({
      base: defaultFilesystem,
      mounts: [
        { mountPoint: "/workspace/app", filesystem: app },
        { mountPoint: "/workspace/.squad", filesystem: squad },
      ],
    });
  },
});

export default defineSandbox(() => environment.open());
