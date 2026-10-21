import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Chooses the tech stack, project structure, data model, and tooling (lint, typecheck, test commands) from the spec, recording decisions in .squad/architecture.md and ADRs. Use after the spec and before tickets.",
  model: "anthropic/claude-opus-5.5",
  reasoning: "high",
});
