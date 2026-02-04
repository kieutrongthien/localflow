# Task 004: Whitelist kênh IPC + validator payload

**Created:** 2026-02-05  
**Story:** 006  
**Assignee:** Colin  
**Estimate:** 3h  
**Priority:** High  
**Status:** Done (2026-02-05 - Colin)

## Description
Định nghĩa danh sách kênh IPC hợp lệ, validate payload bằng zod/ajv.

## Subtasks
- [x] Danh sách kênh IPC cho phép (IPC_CHANNELS + allowedChannels)
- [x] Validator schema payload (zod schemas + validateIpcPayload)
- [x] Unit test IPC handlers (vitest whitelist suite)

## Blockers
None

## Notes
- Shared schema module (src/shared/ipc/schemas.ts) centralizes whitelist + payload validation via zod
- Main process đăng ký handler qua registerIpcHandler/bootIpc; renderer chỉ invoke được khi channel nằm trong allowedChannels
- Preload expose API tối giản; vitest đảm bảo payload sai bị chặn
