import { defineAgent } from "eve";
import { anthropic } from "eve/models/anthropic";

export default defineAgent({
  description:
    "Splits a ticket whose implementation would exceed ~150 changed lines into ordered, independently verifiable sub-tickets of at most ~150 lines each.",
  model: anthropic("claude-sonnet-5-5"),
  reasoning: "medium",
});
