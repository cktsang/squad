import { defineAgent } from "eve";
import { anthropic } from "eve/models/anthropic";

export default defineAgent({
  description:
    "Interviews the user in rounds until a vague idea or unclear requirement is fully understood, then writes .squad/brief.md. Use first for any new idea, and whenever a later step hits an open question only the user can answer.",
  model: anthropic("claude-sonnet-5-5"),
  reasoning: "high",
});
