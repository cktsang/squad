import { defineAgent } from "eve";
import { anthropic } from "eve/models/anthropic";

export default defineAgent({
  description:
    "Keeps README, setup instructions, and CHANGELOG in sync with merged tickets. Use after a ticket passes review, or at the end of a milestone.",
  model: anthropic("claude-haiku-5-5"),
  reasoning: "low",
});
