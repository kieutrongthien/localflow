# Epic 002: Quản lý backlog: epics/stories/tasks (local-first)

**Created:** 2026-02-05  
**Priority:** High  
**Status:** To Do

## Description
Thiết kế backlog local-first lưu dưới dạng file trong .planning (Markdown/JSON). SQLite chỉ dùng cho metadata cơ bản (project, settings, recent activity). Liên kết epics↔stories↔tasks dựa trên cấu trúc file và index.

## Goals
- CRUD đầy đủ + auto-increment ID
- Liên kết epics↔stories↔tasks
- Filter/sort/search
- Import/Export (Markdown/JSON)

## Success Criteria
- [ ] Tạo/sửa/xoá hoạt động ổn định
- [ ] Liên kết traceable
- [ ] Export ra Markdown/JSON ok

## Dependencies
Quyết định schema SQLite tối thiểu (metadata)

## Risks
Đồng bộ file và index khi người dùng chỉnh tay

## Related Stories
None yet

## Notes
