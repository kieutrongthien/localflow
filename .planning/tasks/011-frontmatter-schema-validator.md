# Task 011: Định nghĩa schema frontmatter + validator

**Created:** 2026-02-05  
**Story:** 009  
**Assignee:** Colin  
**Estimate:** 3h  
**Priority:** High  
**Status:** Done (2026-02-05 - Colin)

## Description
Chuẩn hoá YAML frontmatter cho epics/stories/tasks và viết validator.

## Subtasks
- [x] Định nghĩa schema cho epic/story/task (shared/planning/schema.ts)
- [x] Viết validator (zod discriminated union + helper)
- [x] Áp dụng khi tạo/sửa file (indexer validate frontmatter trước khi render)

## Blockers
None

## Notes
- Schema chuẩn: title/status/priority/tags/links + đặc thù story/task/epic (points, owner/assignee, childStories)
- Indexer dùng schema validate → bỏ qua file lỗi và log cảnh báo
- Vitest cập nhật kênh IPC planning:index; build + test pass
