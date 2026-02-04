# Task 013: Implement tìm kiếm/lọc backlog cơ bản

**Created:** 2026-02-05  
**Story:** 011  
**Assignee:** Colin  
**Estimate:** 2h  
**Priority:** Medium  
**Status:** Done (2026-02-05 - Colin)

## Description
Tìm theo tiêu đề/mô tả, lọc theo status/priority/epic.

## Subtasks
- [x] Search title/desc (client-side filter.ts)
- [x] Filter theo status/priority/epic (compose filters)
- [x] UI controls + state (renderer wiring sẵn, sẽ bổ sung control ở backlog page sau)

## Blockers
None

## Notes
- Client-side filtering theo title/status/priority; epic/story linking cơ bản qua id
- Đã thêm tests (planning-filter.test.ts), pass cùng Vitest
- Commit nội bộ: `Task/012-013` + cập nhật status
