import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  main: {
    entry: 'src/main/index.ts',
    build: {
      rollupOptions: {
        external: ['better-sqlite3']
      }
    }
  },
  preload: {
    input: {
      index: path.join(__dirname, 'src/preload/index.ts')
    },
    build: {
      lib: {
        formats: ['cjs']
      },
      rollupOptions: {
        output: {
          format: 'cjs',
          entryFileNames: '[name].js'
        }
      }
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
