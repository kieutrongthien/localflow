# Task 010: Cấu hình electron-builder chi tiết (targets + artifact)

**Created:** 2026-02-05  
**Story:** 007  
**Assignee:** Colin  
**Estimate:** 3h  
**Priority:** High  
**Status:** Done (2026-02-05 - Colin)

## Description
Thiết lập targets mac/win/linux, artifact naming, paths; smoke build nội bộ.

## Subtasks
- [x] Thêm file cấu hình electron-builder (electron-builder.config.cjs chi tiết)
- [x] Targets + artifact naming chuẩn (mac/win/linux + NSIS options)
- [x] Build thử và ghi chú vấn đề (AppImage OK, rebuild better-sqlite3 thất bại do thiếu Python distutils)

## Blockers
None

## Notes
- Config hoá targets: Linux (AppImage + deb), Windows (nsis + zip, tùy chọn folders), macOS (dmg + zip) với artifactName chung
- Extra resources + scripts đã cập nhật; release/ chứa platform builds
- `npm run package` chặn ở bước rebuild `better-sqlite3` vì môi trường thiếu module Python `distutils`; cần cài python3-distutils hoặc prebuilt binary khi chạy CI
