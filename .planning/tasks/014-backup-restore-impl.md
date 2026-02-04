# Task 014: Implement backup/restore .planning + SQLite

**Created:** 2026-02-05  
**Story:** 013  
**Assignee:** Colin  
**Estimate:** 2h  
**Priority:** Medium  
**Status:** Done (2026-02-05 - Colin)

## Description
Tạo backup với timestamp cho .planning và DB; UI khôi phục chọn phiên bản.

## Subtasks
- [x] Backup .planning + DB SQLite (tạo thư mục .localflow_backups, copy .planning + db)
- [x] Danh sách backup + chọn restore (IPC list/restore + UI danh sách)
- [x] Kiểm tra hồi phục thành công (restore và re-index lại, UI cập nhật)

## Blockers
None

## Notes
- Không upload mạng; backup lưu nội bộ trong `.localflow_backups/<ISO_TIMESTAMP>`
- Restore có debounce UI (sau restore, indexer chạy lại và bảng backlog cập nhật)
- Nếu cần nén .zip hoặc chọn thư mục backup ngoài, sẽ thêm tuỳ chọn sau
