import { defineAgent } from "eve";
import { anthropic } from "eve/models/anthropic";

export default defineAgent({
  description:
    "Writes complete tickets from the spec and architecture: user story, use cases, Given/When/Then acceptance criteria, dependencies, and test notes, one file per ticket under .squad/tickets/.",
  model: anthropic("claude-sonnet-5-5"),
  reasoning: "medium",
});
