# Developer Setup

## Yêu cầu môi trường
- Node.js >= 20 (đã test trên 22)
- npm >= 9
- OS: Linux/macOS/Windows (packaging tuỳ platform)

## Cài đặt
```bash
npm install
```

## Chạy dev
```bash
npm run dev
```
- Renderer: Vite HMR
- Main/Preload: electron-vite dev server
- DevTools: phím tắt trong dev (Ctrl/Cmd+Shift+I, F12)

## Build
```bash
npm run build
```
- Đầu ra: dist/renderer, out/main, out/preload

## Packaging
```bash
npm run package       # Linux AppImage
npm run package:all   # macOS/Windows/Linux
```
Cấu hình: electron-builder.config.cjs

## Test
```bash
npm test
```
- Vitest cho shared/main logic
- E2E smoke: `npm run e2e:smoke`

## Cấu hình nội bộ
- DB path: Settings → hiển thị
- Activity log: có thể bật/tắt
- Indexer excludes: CSV trong Settings
- Update feed nội bộ: JSON file path trong Settings

## Quy tắc commit
- Mỗi task: `git add .` và commit theo mẫu: `Task/<ID>-<slug>: <mô tả ngắn>`
- Không push tự động; review và push do người dùng thực hiện
