import { defineParentSandbox } from "eve/sandbox";

// Work in the orchestrator's /workspace so every role sees the same files.
export default defineParentSandbox();
