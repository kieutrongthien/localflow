# Contributing

## Quy tắc chung
- Bảo mật: contextIsolation bật, preload API qua IPC whitelist + zod validate.
- Không dùng network công khai cho backup/update.
- Hoạt động theo Local-first.

## Quy trình làm việc
- Mỗi task trong `.planning/tasks` có Status rõ ràng.
- Khi hoàn tất task: `git add .` và commit theo mẫu `Task/<ID>-<slug>: <mô tả ngắn>`.
- Không push: người dùng sẽ review và push.

## Code style
- TypeScript strict, lint theo eslint config.
- Renderer: Tailwind utility-first, tránh CSS nặng.
- Test: Vitest (unit), scripts E2E smoke.

## Kiến trúc
- Electron + Vite + Vue 3.
- Main: IPC handlers được whitelist/validate.
- Preload: bridge API typed.
- Renderer: Vue Router pages (Overview/Backlog/Boards/Settings).
- Storage: better-sqlite3 + activity optional.

