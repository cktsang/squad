import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Interviews the user in rounds until a vague idea or unclear requirement is fully understood, then writes .squad/brief.md. Use first for any new idea, and whenever a later step hits an open question only the user can answer.",
  model: "anthropic/claude-opus-5.5",
  reasoning: "high",
});
