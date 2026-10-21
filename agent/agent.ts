import { defineAgent } from "eve";
import { anthropic } from "eve/models/anthropic";

export default defineAgent({
  // Every agent calls Anthropic directly with ANTHROPIC_API_KEY from .env.
  model: anthropic("claude-sonnet-5-5"),
  reasoning: "high",
  // Only the declared specialists do work; no generic copies of the orchestrator.
  tool: false,
  // just-bash ships native codecs; load it from node_modules instead of bundling it.
  build: { externalDependencies: ["just-bash"] },
});
