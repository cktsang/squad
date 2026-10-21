import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Quickly gathers only the files, symbols, conventions, and commands a ticket needs and writes a compact context pack to .squad/context/<ticket>.md. Use before decomposing or coding a ticket.",
  model: "anthropic/claude-haiku-5.5",
  reasoning: "low",
});
