# Task 007: Bootstrap README.md cho .planning

**Created:** 2026-02-05  
**Story:** 003  
**Assignee:** Colin  
**Estimate:** 2h  
**Priority:** Medium  
**Status:** Done (2026-02-05 - Colin)

## Description
Sinh README.md chuẩn với metadata cơ bản; hướng dẫn cấu trúc epics/stories/tasks.

## Subtasks
- [x] Tạo template README.md (shared/planning/readmeTemplate.ts)
- [x] Ghi file vào .planning khi chọn thư mục
- [x] Hiển thị sau import (renderer tự load README sau khi chọn folder)

## Blockers
None

## Notes
- Template chứa metadata + hướng dẫn, timestamp ISO; sẽ sync frontmatter sau story 009
- Auto tạo khi .planning thiếu README, renderer hiển thị nội dung ngay
