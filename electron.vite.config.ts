import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  main: {
    entry: 'src/main/index.ts'
  },
  preload: {
    input: {
      index: path.join(__dirname, 'src/preload/index.ts')
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': path.join(__dirname, 'src/renderer/src')
      }
    },
    build: {
      outDir: 'dist/renderer'
    },
    plugins: [vue()]
  }
})
