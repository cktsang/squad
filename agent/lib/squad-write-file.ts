import { defineTool } from "eve/tools";
import { writeFile } from "eve/tools/write_file";

// Root of the shared workflow artifacts (brief, spec, tickets, context packs, reports).
export const SQUAD_DIR = "/workspace/.squad/";

/**
 * A `write_file` that may only write workflow artifacts under /workspace/.squad/.
 * Used by roles that document and judge work but must never touch product code.
 */
export const squadWriteFile = defineTool({
  ...writeFile,
  description: `Write a complete workflow artifact file. Only paths under ${SQUAD_DIR} are allowed; product code is off-limits for this role.`,
  execute(input, ctx) {
    const path = input.filePath.startsWith("/") ? input.filePath : `/workspace/${input.filePath}`;
    if (!path.startsWith(SQUAD_DIR) || path.includes("..")) {
      throw new Error(`write_file is limited to ${SQUAD_DIR} for this role`);
    }
    return writeFile.execute(input, ctx);
  },
});
