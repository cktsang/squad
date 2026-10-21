# squad

An AI software squad built on [eve](https://eve.dev). You give it an idea; an orchestrator delegates to specialist subagents that clarify it, specify it, plan it into tickets, and build each ticket with testing, verification, and review, then run a retro after each milestone.

## How it works

```
idea → clarifier → spec-writer → architect → ticket-writer
                                                  │
        ┌─────────────── per ticket ──────────────┘
        ▼
context-scout → decomposer (if > ~150 lines) → verifier (ready gate)
  → coder → tester → verifier (done gate) → reviewer + security-reviewer → docs-writer
        ▲                                   │
        └──────── failures and findings ────┘

milestone done → retro
```

The orchestrator asks you to approve the spec, the stack, and the ticket list before building. If a ticket fails its fix loop three times, it stops and asks you how to proceed.

The squad runs as a **sidecar**: this repo holds only the agent, and it works on a project in another folder. Nothing from this repo is copied into that project. Only the artifacts the squad produces (spec, tickets, decisions) are written there, in a `.squad/` folder.

## How the sidecar works

```
~/Projects/squad (this repo)          ~/Projects/my-app (your project)
  agent/  .env.local                    src/ package.json ...
     │                                  .squad/  brief, spec, tickets, reports
     │  eve dev                            ▲   ▲
     ▼                                     │   │
  sandbox (virtual shell)                  │   │
    /workspace/app     ── mounted ─────────┘   │   read-write
    /workspace/.squad  ── mounted ─────────────┘   (= my-app/.squad)
    host <cmd>         ── runs on your machine in my-app/
```

- **`SQUAD_TARGET`** in `.env.local` names the project folder. It is created if it does not exist, so you can start from an empty folder.
- **Files:** every role works in one shared sandbox. The project folder is mounted at `/workspace/app` and the artifacts folder at `/workspace/.squad`, so edits land directly in your real files.
- **Commands:** the sandbox's shell is virtual (just-bash). File commands such as `ls`, `grep`, and `sed` work, but real programs do not. Roles run those through `host`, for example `host npm test` or `host git diff`. `host` runs the program on your machine, inside the project folder, with the squad's own tokens removed from its environment.
- **Artifacts:** `my-app/.squad/` is created with the Definition of Ready, Definition of Done, and a `.gitignore` that keeps the per-ticket `context/` and `reports/` out of git. Commit the rest with the project. Set `SQUAD_ARTIFACTS` to keep them elsewhere.
- **Git:** every ticket gets its own branch, `squad/<ticket-id>-<slug>`, created from `main`, or from the branch of a dependency whose pull request is still open. The coder runs `git init` first if needed and commits once the ticket passes review. With GitHub enabled, it then pushes the branch with your own git credentials, and the orchestrator opens a pull request. The squad only ever pushes `squad/*` branches: never `main`, never force-push, never merge. The coder switches branches in your project folder, so commit or stash your own changes there before a run.
- **Switching projects:** change `SQUAD_TARGET` and restart `npm run dev`. Each project keeps its own `.squad/`, so you can come back to it later.

`host` commands are not sandboxed: they run as you, on your machine. Use the squad only on projects and ideas you trust it with.

## Roles and models

| Role              | Model      | Responsibility                                                                      |
| ----------------- | ---------- | ----------------------------------------------------------------------------------- |
| orchestrator      | Sonnet 5.5 | Plans, routes work, tracks the board, talks to you                                  |
| clarifier         | Sonnet 5.5 | Asks rounds of questions until the idea is clear                                    |
| spec-writer       | Sonnet 5.5 | Full functional spec: features, flows, data, non-functional requirements            |
| architect         | Opus 5.5   | Stack, layout, data model, and the lint/typecheck/test commands                     |
| ticket-writer     | Sonnet 5.5 | Tickets with user stories, use cases, Given/When/Then criteria                      |
| context-scout     | Haiku 5.5  | Gathers just the context a ticket needs into a context pack                         |
| decomposer        | Sonnet 5.5 | Splits tickets into steps of at most ~150 lines                                     |
| coder             | Sonnet 5.5 | Implements one ticket with tests                                                    |
| tester            | Haiku 5.5  | Runs format, lint, typecheck, tests, and build; reports exact failures              |
| verifier          | Sonnet 5.5 | Definition of Ready before coding; acceptance criteria and Definition of Done after |
| reviewer          | Opus 5.5   | Critical code review of the diff                                                    |
| security-reviewer | Sonnet 5.5 | Security review for tickets touching auth, input, storage, or external calls        |
| docs-writer       | Haiku 5.5  | Keeps README and CHANGELOG current                                                  |
| retro             | Sonnet 5.5 | Milestone retrospective                                                             |

Rule of thumb: Sonnet by default, Opus only where judgment pays off and calls are rare or small (the architect runs once per project; the reviewer only reads a diff), Haiku for fast lookup and running commands.

## Project layout

```
agent/
├── agent.ts               orchestrator model config
├── instructions.md        orchestrator workflow
├── instructions/workspace.ts  shared workspace rules (every role has one)
├── tools/ask_question.ts  approvals and questions to you
├── connections/github.ts  GitHub issues and Projects (optional)
├── lib/
│   ├── target.ts          reads SQUAD_* settings from .env.local
│   ├── host-command.ts    the `host` command
│   ├── github-connection.ts
│   ├── squad-write-file.ts  write_file limited to /workspace/.squad/
│   └── workspace-instructions.ts
├── sandbox/
│   ├── sandbox.ts         mounts the project and artifacts folders
│   └── workspace/.squad/  seeds: Definition of Ready/Done, board.md
└── subagents/<role>/
    ├── agent.ts           description, model, reasoning effort
    ├── sandbox.ts         shares the orchestrator's sandbox
    ├── instructions.md    (or instructions/*.md for clarifier and retro)
    ├── tools/             role-specific tools
    └── connections/       GitHub, for ticket-writer and decomposer
```

Every role except `coder` and `docs-writer` can write only under `/workspace/.squad/`. They still have `bash`, so treat that limit as a guardrail rather than a security boundary.

## Getting started

Requires Node 24.

```bash
npm ci
cp .env.example .env.local   # then set SQUAD_TARGET
npm run dev:web              # web chat at http://localhost:3000
```

Then describe your idea. Every agent calls Anthropic directly with `ANTHROPIC_API_KEY` from `.env` or `.env.local`, so usage and billing show up in the [Anthropic Console](https://console.anthropic.com), not the Vercel AI Gateway.

### Web chat or terminal

| | `npm run dev:web` | `npm run dev` |
| --- | --- | --- |
| Interface | Browser chat at `localhost:3000` (Next.js app in `apps/web/`) | Terminal UI |
| Images, PDFs, files | Paperclip button, drag and drop, or paste (up to 20 MB each) | Save in `.squad/assets/` and mention the path |
| Questions and approvals | Buttons and forms | Typed answers |
| Traces (`/traces`), `/login`, `/model` | No | Yes |

Both talk to the same agent and can run at the same time; the web app reuses a running `eve dev` server. Attached files are copied into the project's `.squad/assets/`, so every role and later session can see them.

The web chat has no sign-in. It is reachable only on this machine, like the rest of the sidecar.

## Tickets on GitHub (optional)

By default, tickets are Markdown files in `.squad/tickets/` with a status table in `.squad/board.md`. To use GitHub instead, set these in `.env.local`:

| Variable | Value |
| --- | --- |
| `SQUAD_GITHUB_REPO` | `owner/repo` of the project's repository |
| `SQUAD_GITHUB_PROJECT` | Optional: number of a GitHub Projects board owned by the same owner |
| `GITHUB_TOKEN` | A fine-grained token with Issues and Pull requests read/write on that repo, or a classic token with `repo` and `project` scopes when you use a Projects board |

The squad then connects to GitHub's official MCP server, limited to the issues, labels, projects, and pull requests toolsets:

- After you approve the ticket list, the ticket-writer creates one issue per ticket, with labels for milestone, feature, and size, and adds it to the board.
- The decomposer creates sub-issues under the parent issue.
- The orchestrator comments each gate result on the issue and moves the board item (In Progress, In Review, Done).
- When a ticket passes review, the orchestrator opens a pull request from its branch. The PR lists each acceptance criterion with the test that proves it, links the gate reports, and says `Closes #<issue>`. You review and merge it; merging closes the issue. The squad can't merge: the merge tools are hidden from it.
- Calls that GitHub marks as destructive ask for your approval first.

The ticket files stay in `.squad/tickets/` as the squad's working copy, each with its issue number.

## Customize

- **Your standards:** the Definition of Ready and Definition of Done are copied from `agent/sandbox/workspace/.squad/` into each new project's `.squad/`. Edit the seeds to change the default, or edit a project's copy to change only that project.
- **A role's behavior:** edit `agent/subagents/<role>/instructions.md`.
- **A role's model:** edit `model` and `reasoning` in `agent/subagents/<role>/agent.ts`.
- **Coding standards for the reviewer:** have the squad create `/workspace/.squad/coding-standards.md`; the reviewer enforces it when present, and the retro proposes additions.

## Commands

| Command              | What it does                                 |
| -------------------- | -------------------------------------------- |
| `npm run dev:web`    | Start the web chat and the agent             |
| `npm run dev`        | Start the terminal UI and the agent          |
| `npm run check`      | Dependency drift check, typecheck, and build |
| `npm run check:deps` | Dependency drift check only                  |
| `npm run typecheck`  | TypeScript check                             |
| `npm run build`      | Build the agent                              |

## Dependencies are pinned

eve is in beta, and floating versions of `ai`/`@ai-sdk/*` or `@vercel/connect` have broken eve apps at runtime. Every dependency is pinned exactly, `.npmrc` sets `save-exact`, and `package-lock.json` is committed. `npm run check:deps` fails on version ranges, a lockfile out of sync with `package.json`, or canary/beta builds of the AI and eve packages.

To upgrade, change one package at a time to an exact version, run `npm run check`, and commit `package.json` and `package-lock.json` together.

## Local only

The sidecar mounts folders on your machine and runs `host` commands there, so it is meant for `npm run dev`, not `eve deploy`. A deployed version would need a different sandbox that clones the project from GitHub and opens pull requests.

## Learn more

- [eve documentation](https://eve.dev/docs)
- [eve on GitHub](https://github.com/vercel/eve)
