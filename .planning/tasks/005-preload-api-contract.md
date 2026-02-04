# Task 005: Định nghĩa hợp đồng API preload (renderer sử dụng)

**Created:** 2026-02-05  
**Story:** 006  
**Assignee:** Colin  
**Estimate:** 2h  
**Priority:** High  
**Status:** Done (2026-02-05 - Colin)

## Description
Xác định các hàm API được expose qua contextBridge cho renderer: chọn thư mục, đọc .planning, ghi README.

## Subtasks
- [x] Spec API (LocalflowBridge interface + IPC schema map)
- [x] Implement bridge gọi IPC main (preload invokeSafe + main handlers)
- [x] Unit test contract (Vitest schema whitelist)

## Blockers
None

## Notes
- Định nghĩa LocalflowBridge (ping, getVersion, selectProjectRoot, read/write README)
- IPC schema sử dụng zod đảm bảo payload hợp lệ; select folder dùng dialog Electron
- Main handler thao tác README trong .planning, tạo thư mục nếu thiếu; renderer có UI demo để test bridge
