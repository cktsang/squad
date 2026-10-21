import { defineInstructions } from "eve/instructions";

// Shared by the orchestrator and every subagent; they all work in the same sandbox.
export const workspaceInstructions = defineInstructions({
  content: `# Workspace

- \`/workspace/app\` is the target project's real folder on the user's machine. Edits there change the user's files.
- \`/workspace/.squad\` holds the squad's workflow artifacts. By default it is the project's own \`.squad/\` folder, so it may also appear at \`/workspace/app/.squad\`; always use the \`/workspace/.squad\` path. Never put product code there.
- Read \`/workspace/.squad/config.md\` for the project name, where tickets live (GitHub or local files), and the Projects board.
- \`bash\` is a virtual shell: file commands such as \`ls\`, \`cat\`, \`grep\`, \`sed\`, \`find\`, and \`mkdir\` work, but real programs do not. Prefix those with \`host\`, for example \`host npm test\`, \`host npx tsc --noEmit\`, \`host git status\`. \`host\` runs in the matching folder under \`/workspace/app\`. For pipes or \`&&\` inside the project, use \`host sh -c '...'\`.
- Never run \`host git push\`, publish, deploy, or touch anything outside the project folder. Report the need to the orchestrator instead.
`,
});
