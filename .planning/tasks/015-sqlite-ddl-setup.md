# Task 015: SQLite: tạo DDL tối thiểu + tích hợp

**Created:** 2026-02-05  
**Story:** 004  
**Assignee:** Colin  
**Estimate:** 2h  
**Priority:** Medium  
**Status:** Done (2026-02-05 - Colin)

## Description
Tạo bảng projects/settings/activity (optional), kết nối DB file, helper CRUD.

## Subtasks
- [x] DDL cho projects/settings/activity (better-sqlite3, WAL)
- [x] Helper CRUD (upsert/list projects, active path, activity log)
- [x] Config đường dẫn DB (app.getPath('userData')/data/localflow.db)

## Blockers
None

## Notes
- DB nằm trong thư mục dữ liệu ứng dụng (userData/data/localflow.db), tách biệt repo
- Thêm logActivity cho các thao tác chính (select project, save metadata, backup create/restore)
