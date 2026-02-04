# Task 009: Indexer: quét .planning và render danh sách backlog

**Created:** 2026-02-05  
**Story:** 005  
**Assignee:** Colin  
**Estimate:** 3h  
**Priority:** High  
**Status:** Done (2026-02-05 - Colin)

## Description
Đọc epics/stories/tasks từ .planning, parse ID + frontmatter, hiển thị trong UI.

## Subtasks
- [x] Quét thư mục epics/stories/tasks (buildPlanningIndex + gray-matter)
- [x] Parse frontmatter + ID (title/status/priority/points/links)
- [x] Render list + tổng quan đếm (renderer bảng backlog)

## Blockers
None

## Notes
- IPC `planning:index` trả về danh sách + totals, tolerant với thư mục thiếu
- Renderer hiển thị bảng backlog + badges, auto reload sau chọn thư mục
- npm test & build pass; gray-matter thêm cảnh báo eval (upstream)
