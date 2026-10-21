import { defineAgent } from "eve";
import { anthropic } from "eve/models/anthropic";

export default defineAgent({
  description:
    "Gates tickets: checks a ticket against the Definition of Ready before coding, and checks finished work against its acceptance criteria and the Definition of Done after coding.",
  model: anthropic("claude-sonnet-5-5"),
  reasoning: "high",
});
