import { anthropic } from "eve/models/anthropic";
import { defineAgent } from "eve";

export default defineAgent({
  model: anthropic("claude-sonnet-5"),
  reasoning: "high",
  // Only the declared specialists do work; no generic copies of the orchestrator.
  tool: false,
  // just-bash ships native codecs; load it from node_modules instead of bundling it.
  build: { externalDependencies: ["just-bash"] },
});
