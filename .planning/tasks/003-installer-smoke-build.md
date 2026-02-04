# Task 003: Build installer smoke test (mac/win/linux)

**Created:** 2026-02-05  
**Story:** 001  
**Assignee:** Colin  
**Estimate:** 3h  
**Priority:** High  
**Status:** Done (2026-02-05 - Colin)

## Description
Cấu hình electron-builder tối thiểu và build thử installer cho các nền tảng.

## Subtasks
- [x] Thêm cấu hình electron-builder (electron-builder.config.cjs, devDependencies, scripts)
- [x] Build thử Linux AppImage (npm run package)
- [x] Kiểm tra cài đặt và chạy (AppImage launch OK, các nền tảng khác cấu hình sẵn đợi CI)

## Blockers
None

## Notes
- electron-builder config gom out/main, out/preload, dist/renderer và set extraMetadata main
- Scripts mới: `npm run package` (Linux AppImage tại release/), `npm run package:all` để build Mac/Win trên CI phù hợp
- Build assets nằm trong build/icon.png; release artifacts bị .gitignore
- Chạy smoke: AppImage boot lên shell LocalFlow bình thường
