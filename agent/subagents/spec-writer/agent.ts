import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Turns the confirmed brief into a complete product spec (.squad/spec.md): every feature, user flow, data entity, non-functional requirement, and explicit out-of-scope list.",
  model: "anthropic/claude-opus-5.5",
  reasoning: "high",
});
