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

All roles share one sandbox workspace:

- `/workspace/app/`: the product code
- `/workspace/.squad/`: workflow artifacts (`brief.md`, `spec.md`, `architecture.md`, `adr/`, `tickets/`, `context/`, `reports/`, `retro/`, `board.md`)

## Roles and models

| Role              | Model      | Responsibility                                                                      |
| ----------------- | ---------- | ----------------------------------------------------------------------------------- |
| orchestrator      | Opus 5.5   | Plans, routes work, tracks the board, talks to you                                  |
| clarifier         | Opus 5.5   | Asks rounds of questions until the idea is clear                                    |
| spec-writer       | Opus 5.5   | Full functional spec: features, flows, data, non-functional requirements            |
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

Rule of thumb: Opus for decisions made once that shape everything downstream (and for review, which only reads a diff), Sonnet for per-ticket work, Haiku for fast lookup and running commands.

## Project layout

```
agent/
├── agent.ts               orchestrator model config
├── instructions.md        orchestrator workflow
├── tools/ask_question.ts  approvals and questions to you
├── lib/squad-write-file.ts  write_file limited to /workspace/.squad/
├── sandbox/workspace/.squad/
│   ├── definition-of-ready.md
│   ├── definition-of-done.md
│   └── board.md
└── subagents/<role>/
    ├── agent.ts           description, model, reasoning effort
    ├── sandbox.ts         shares the orchestrator's sandbox
    ├── instructions.md    (or instructions/ for clarifier and retro)
    └── tools/             role-specific tools
```

Every role except `coder` and `docs-writer` can write only under `/workspace/.squad/`. They still have `bash`, so treat that limit as a guardrail rather than a security boundary.

## Getting started

Requires Node 24.

```bash
npm ci
npm run dev
```

`eve dev` opens a terminal session. eve reuses an existing model connection or prompts you with `/login`; models are routed through the Vercel AI Gateway. Then describe your idea.

## Customize

- **Your team's standards:** edit `definition-of-ready.md` and `definition-of-done.md` in `agent/sandbox/workspace/.squad/`. The seed is copied when a new sandbox environment is prepared; an existing live sandbox keeps its copy.
- **A role's behavior:** edit `agent/subagents/<role>/instructions.md`.
- **A role's model:** edit `model` and `reasoning` in `agent/subagents/<role>/agent.ts`.
- **Coding standards for the reviewer:** have the squad create `/workspace/.squad/coding-standards.md`; the reviewer enforces it when present, and the retro proposes additions.

## Commands

| Command              | What it does                                 |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Start the local dev session                  |
| `npm run check`      | Dependency drift check, typecheck, and build |
| `npm run check:deps` | Dependency drift check only                  |
| `npm run typecheck`  | TypeScript check                             |
| `npm run build`      | Build the agent                              |
| `npm run deploy`     | Deploy to Vercel                             |

## Dependencies are pinned

eve is in beta, and floating versions of `ai`/`@ai-sdk/*` or `@vercel/connect` have broken eve apps at runtime. Every dependency is pinned exactly, `.npmrc` sets `save-exact`, and `package-lock.json` is committed. `npm run check:deps` fails on version ranges, a lockfile out of sync with `package.json`, or canary/beta builds of the AI and eve packages.

To upgrade, change one package at a time to an exact version, run `npm run check`, and commit `package.json` and `package-lock.json` together.

## Deploy on Vercel

```bash
eve deploy
```

`eve deploy` links a Vercel project if needed and deploys to production. Before deploying, replace `placeholderAuth()` in `agent/channels/eve.ts` with your auth provider. See the [eve deployment docs](https://eve.dev/docs/guides/deployment/vercel).

## Learn more

- [eve documentation](https://eve.dev/docs)
- [eve on GitHub](https://github.com/vercel/eve)
