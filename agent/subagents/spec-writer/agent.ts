import { defineAgent } from "eve";
import { anthropic } from "eve/models/anthropic";

export default defineAgent({
  description:
    "Turns the confirmed brief into a complete product spec (.squad/spec.md): every feature, user flow, data entity, non-functional requirement, and explicit out-of-scope list.",
  model: anthropic("claude-opus-5-5"),
  reasoning: "high",
});
