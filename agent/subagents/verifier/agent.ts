import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Gates tickets: checks a ticket against the Definition of Ready before coding, and checks finished work against its acceptance criteria and the Definition of Done after coding.",
  model: "anthropic/claude-sonnet-5.5",
  reasoning: "high",
});
