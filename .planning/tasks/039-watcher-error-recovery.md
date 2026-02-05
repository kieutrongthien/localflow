# Task 039: Xử lý lỗi watcher & khôi phục

**Created:** 2026-02-05  
**Story:** 010  
**Assignee:** Colin  
**Estimate:** 2h  
**Priority:** Medium  
**Status:** Done (2026-02-05 - Colin)

## Description
Xử lý lỗi quyền/đường dẫn khi theo dõi .planning; retry/backoff; thông báo phù hợp.

## Subtasks
- [x] Phát hiện lỗi (lắng nghe watcher.on('error'))
- [x] Retry/backoff (exponential, tối đa 60s)
- [x] Thông báo người dùng (IPC planning:watch-error/recovered + toast)

## Blockers
None

## Notes
Quan trọng với dự án lớn hoặc quyền hạn khác nhau
