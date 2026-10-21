import { defineAgent } from "eve";
import { anthropic } from "eve/models/anthropic";

export default defineAgent({
  description:
    "Runs a retrospective over a finished milestone using its tickets and reports, and proposes concrete improvements to the squad's instructions, checks, and definitions.",
  model: anthropic("claude-sonnet-5-5"),
  reasoning: "high",
});
