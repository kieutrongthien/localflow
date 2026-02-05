# Task 030: Đảm bảo ghi trạng thái Kanban nhất quán

**Created:** 2026-02-05  
**Story:** 012  
**Assignee:** Colin  
**Estimate:** 2h  
**Priority:** Medium  
**Status:** Done (2026-02-05 - Colin)

## Description
Đồng bộ giữa drag-drop, watcher, và parser frontmatter để tránh race/ghi đè.

## Subtasks
- [x] Lock/queue cập nhật (AsyncLock per-path)
- [x] Kiểm tra watcher re-index (giữ như hiện tại; cập nhật tuần tự)
- [x] Test case cạnh tranh (vitest: locks.test)

## Blockers
None

## Notes
Quan trọng cho UX ổn định
