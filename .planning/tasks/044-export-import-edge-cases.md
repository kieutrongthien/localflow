# Task 044: Export/Import: xử lý edge cases

**Created:** 2026-02-05  
**Story:** 002  
**Assignee:** Colin  
**Estimate:** 3h  
**Priority:** High  
**Status:** Done (2026-02-05 - Colin)

## Description
Xử lý xung đột ID/filename, thiếu/không hợp lệ frontmatter; báo cáo rõ ràng.

## Subtasks
- [x] Detect xung đột + đề xuất giải pháp (suffix -import-N, trả conflicts)
- [x] Normalize dữ liệu thiếu (title fallback, skip invalid type)
- [x] Báo cáo lỗi + log chi tiết (errors list + activity log; UI hiển thị tổng conflicts/errors)

## Blockers
None

## Notes
Gắn với 026-export-import-tools
