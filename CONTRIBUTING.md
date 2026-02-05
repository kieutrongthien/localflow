# Contributing

## General principles
- Security: contextIsolation enabled; preload API communicates via IPC with zod-validated whitelists.
- No public network use for backup/update.
- Local-first operation by design.

## Workflow
- Each task in `.planning/tasks` has a clear Status.
- When completing a task: run `git add .` and commit with the format `Task/<ID>-<slug>: <short description>`.
- Do not push automatically; the user will review and push changes.

## Code style
- TypeScript (strict). Lint according to the project eslint config.
- Renderer: Tailwind (utility-first). Avoid heavy custom CSS.
- Tests: Vitest for unit tests; E2E smoke via scripts.

## Architecture
- Electron + Vite + Vue 3.
- Main process: IPC handlers are whitelisted and validated.
- Preload: typed bridge API.
- Renderer: Vue Router pages (Overview, Backlog, Boards, Settings).
- Storage: better-sqlite3 with optional activity logging.
