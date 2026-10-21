import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Reviews a diff for security issues: injection, authn/authz gaps, secrets in code, unsafe input handling, and risky dependencies. Use for tickets touching auth, user input, data storage, or external calls.",
  model: "anthropic/claude-sonnet-5.5",
  reasoning: "high",
});
