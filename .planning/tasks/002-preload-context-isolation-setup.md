# Task 002: Thiết lập preload + contextIsolation cho IPC an toàn

**Created:** 2026-02-05  
**Story:** 001  
**Assignee:** Colin  
**Estimate:** 2h  
**Priority:** High  
**Status:** Done (2026-02-05 - Colin)

## Description
Tạo preload script, bật contextIsolation, expose API tối thiểu cho renderer.

## Subtasks
- [x] Tạo preload.ts
- [x] Bật contextIsolation, disable remote
- [x] Expose API qua contextBridge (ping + getVersion)

## Blockers
None

## Notes
- BrowserWindow webPreferences: contextIsolation true, nodeIntegration false, remote disabled, sandbox on
- Preload bridge exposes strict API with contextBridge + ipcRenderer invoke
- Renderer hiển thị ping + version để smoke-test IPC, build pass
