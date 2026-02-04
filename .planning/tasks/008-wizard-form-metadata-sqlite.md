# Task 008: Xây wizard form metadata + lưu SQLite

**Created:** 2026-02-05  
**Story:** 008  
**Assignee:** Colin  
**Estimate:** 3h  
**Priority:** High  
**Status:** Done (2026-02-05 - Colin)

## Description
Tạo form nhập tên, mô tả, team, ngày bắt đầu/kết thúc; validate và lưu vào DB.

## Subtasks
- [x] UI form (Vue + Tailwind) với wizard metadata
- [x] Validation + error UX (client-side + zod IPC)
- [x] Lưu bảng projects + settings (better-sqlite3 + settings table)

## Blockers
None

## Notes
- Thêm project metadata handler (get/save) + lưu SQLite (project_metadata, settings.activeProjectPath)
- Preload bridge expose API typed; renderer wizard form validate + lưu team/start/end
- Sau khi lưu dùng status hiển thị, npm test + npm run build pass
