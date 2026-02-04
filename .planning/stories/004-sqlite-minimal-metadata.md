# Story 004: SQLite tối thiểu cho metadata dự án

**Created:** 2026-02-05  
**Epic:** 005  
**Points:** 3  
**Priority:** Medium  
**Status:** To Do

## User Story
As a **developer**,  
I want to **tạo schema SQLite lưu thông tin cơ bản**,  
So that **ứng dụng có thể đọc/ghi cấu hình mà không ảnh hưởng backlog file**.

## Acceptance Criteria
- [ ] Bảng projects(id, name, path, created_at)
- [ ] Bảng settings(key, value)
- [ ] Bảng activity(id, type, ref, created_at) optional
- [ ] Kết nối tới DB file local

## Technical Notes
DB đặt trong thư mục app dữ liệu người dùng, không trộn vào repo

## Dependencies
None

## Related Tasks
None yet

## Definition of Done
- [ ] Code implemented and reviewed
- [ ] Unit tests written and passing
- [ ] Documentation updated
- [ ] Acceptance criteria verified
