# Task 006: Implement directory picker + detect .planning

**Created:** 2026-02-05  
**Story:** 003  
**Assignee:** Colin  
**Estimate:** 3h  
**Priority:** High  
**Status:** Done (2026-02-05 - Colin)

## Description
Thêm UI chọn thư mục dự án; kiểm tra tồn tại .planning; tạo mới nếu thiếu.

## Subtasks
- [x] UI chọn thư mục (Electron dialog + preload bridge demo UI)
- [x] Kiểm tra .planning
- [x] Tạo .planning + README template + auto load

## Blockers
None

## Notes
- Handler select-root đảm bảo .planning tồn tại, tự tạo README template khi thiếu
- Default template trong shared/planning/readmeTemplate.ts; renderer hiển thị trạng thái tạo mới
- Dùng better-sqlite3 lưu/ cập nhật đường dẫn dự án (table projects) tại app userData để re-open sau
