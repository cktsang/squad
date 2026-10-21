import { defineAgent } from "eve";
import { anthropic } from "eve/models/anthropic";

export default defineAgent({
  description:
    "Implements exactly one ready ticket (or sub-ticket) in the workspace using its context pack, with tests, then reports the changed files. Also fixes findings returned by tester, verifier, or reviewers.",
  model: anthropic("claude-sonnet-5-5"),
  reasoning: "medium",
});
