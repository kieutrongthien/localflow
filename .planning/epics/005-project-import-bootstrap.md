# Epic 005: Nhập dự án từ thư mục + khởi tạo .planning

**Created:** 2026-02-05  
**Priority:** High  
**Status:** To Do

## Description
Cho phép người dùng chọn thư mục source local; phát hiện .planning, tạo mới nếu thiếu; hướng dẫn nhập thông tin dự án.

## Goals
- File picker chọn thư mục dự án
- Phát hiện/khởi tạo .planning
- Wizard nhập metadata (tên, mô tả, team, thời gian)
- Index hoá epics/stories/tasks từ .planning

## Success Criteria
- [ ] Chọn thư mục → nhận diện dự án thành công
- [ ] Nếu thiếu .planning → tạo và ghi README
- [ ] Danh sách epics/stories/tasks hiện lên

## Dependencies
App shell & UI cơ bản

## Risks
Quyền truy cập file hệ thống, path không hợp lệ

## Related Stories
None yet

## Notes
