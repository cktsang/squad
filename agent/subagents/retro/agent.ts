import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Runs a retrospective over a finished milestone using its tickets and reports, and proposes concrete improvements to the squad's instructions, checks, and definitions.",
  model: "anthropic/claude-sonnet-5.5",
  reasoning: "high",
});
