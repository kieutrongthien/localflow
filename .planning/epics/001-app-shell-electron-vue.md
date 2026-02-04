# Epic 001: Electron v39 + Vue 3 app shell & packaging

**Created:** 2026-02-05  
**Priority:** High  
**Status:** To Do

## Description
Khởi tạo khung ứng dụng Electron (Node 22) với Vue 3, cấu hình build/packaging, IPC main<->renderer, auto-update.

## Goals
- Bootstrap dự án (Electron + Vite + Vue 3)
- Thiết lập IPC và security (contextIsolation, preload)
- Đóng gói đa nền tảng (mac/win/linux)
- Auto-update (sideload/local repo)

## Success Criteria
- [ ] Ứng dụng chạy được trên mac/win/linux
- [ ] Kiểm tra bảo mật cơ bản pass
- [ ] Build package tạo installer

## Dependencies
Quyết định schema config & update

## Risks
Chênh lệch môi trường build cross-platform

## Related Stories
None yet

## Notes
