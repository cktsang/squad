import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Splits a ticket whose implementation would exceed ~150 changed lines into ordered, independently verifiable sub-tickets of at most ~150 lines each.",
  model: "anthropic/claude-sonnet-5.5",
  reasoning: "medium",
});
