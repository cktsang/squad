import { defineDynamic, defineMcpClientConnection } from "eve/connections";
import { githubEnabled, githubToken } from "#lib/target.js";

// GitHub's official remote MCP server, limited to issues (incl. sub-issues and milestones),
// labels, Projects boards, and pull requests. Merging stays with the user, so merge tools are
// hidden. Present only when SQUAD_GITHUB_REPO and GITHUB_TOKEN are set.
export const githubConnection = defineDynamic({
  events: {
    "session.started": () =>
      githubEnabled
        ? defineMcpClientConnection({
            url: "https://api.githubcopilot.com/mcp/",
            description:
              "GitHub issues, sub-issues, labels, milestones, Projects boards, and pull requests for the target repository.",
            headers: { "X-MCP-Toolsets": "issues,labels,projects,pull_requests" },
            tools: { block: ["merge_pull_request", "update_pull_request_branch"] },
            auth: { getToken: async () => ({ token: githubToken! }) },
            approval: ({ toolAnnotations }) =>
              toolAnnotations?.destructiveHint ? "user-approval" : "not-applicable",
          })
        : null,
  },
});
