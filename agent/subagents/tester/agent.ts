import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Runs the project's install, lint, format check, typecheck, unit, integration, and build commands and reports pass/fail with the exact failing output. Never edits code.",
  model: "anthropic/claude-haiku-5.5",
  reasoning: "low",
});
