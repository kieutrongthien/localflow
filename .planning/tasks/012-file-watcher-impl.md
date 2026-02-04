# Task 012: Implement chokidar file watcher + UI refresh

**Created:** 2026-02-05  
**Story:** 010  
**Assignee:** Colin  
**Estimate:** 2h  
**Priority:** Medium  
**Status:** Done (2026-02-05 - Colin)

## Description
Theo dõi .planning bằng chokidar, debounce và cập nhật UI khi file thay đổi.

## Subtasks
- [x] Thiết lập watcher cho epics/stories/tasks (main/watchPlanningForWindow)
- [x] Debounce sự kiện (awaitWriteFinish + debounce 300ms)
- [x] Trigger re-index + refresh UI (emit IPC planning:index-updated + renderer subscribe)

## Blockers
None

## Notes
- Watcher chỉ chạy khi chọn project; theo dõi .planning/epics|stories|tasks/*.md
- Debounce và awaitWriteFinish để tránh UI giật
- Build/test pass; đã commit mã nguồn (không push)
