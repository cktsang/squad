import { anthropic } from "eve/models/anthropic";
import { defineAgent } from "eve";

export default defineAgent({
  model: anthropic("claude-sonnet-5"),
  reasoning: "high",
  // Only the declared specialists do work; no generic copies of the orchestrator.
  tool: false,
});
