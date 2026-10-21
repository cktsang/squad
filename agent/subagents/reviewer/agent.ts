import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Critically reviews a ticket's diff for correctness bugs, design problems, readability, and missing tests, and returns blocking and non-blocking findings. Does not rubber-stamp.",
  model: "anthropic/claude-opus-5.5",
  reasoning: "high",
});
