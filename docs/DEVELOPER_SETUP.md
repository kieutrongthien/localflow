# Developer Setup

## Requirements
- Node.js >= 20 (tested on 22)
- npm >= 9
- OS: Linux/macOS/Windows (packaging varies by platform)

## Install
```bash
npm install
```

## Development
```bash
npm run dev
```
- Renderer: Vite HMR
- Main/Preload: electron-vite dev server
- DevTools: dev-only shortcuts (Ctrl/Cmd+Shift+I, F12)

## Build
```bash
npm run build
```
- Outputs: dist/renderer, out/main, out/preload

## Packaging
```bash
npm run package       # Linux AppImage
npm run package:all   # macOS/Windows/Linux
```
Configuration: electron-builder.config.cjs

## Tests
```bash
npm test
```
- Vitest for shared/main logic
- E2E smoke: `npm run e2e:smoke`

## Internal configuration
- Database path: shown in Settings
- Activity log: optional toggle in Settings
- Indexer excludes: CSV in Settings
- Internal update feed: JSON file path in Settings

## Commit rules
- For each task: `git add .` and commit in the format `Task/<ID>-<slug>: <short description>`
- Do not push automatically; the user will review and push
