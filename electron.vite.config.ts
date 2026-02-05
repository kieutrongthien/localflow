import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  // Cast as any to satisfy electron-vite config typings
  main: {
    entry: 'src/main/index.ts',
    build: {
      rollupOptions: {
        external: ['better-sqlite3']
      }
    }
  } as any,
  preload: {
    input: {
      index: path.join(__dirname, 'src/preload/index.ts')
    },
    build: {
      rollupOptions: {
        output: {
          format: 'cjs',
          entryFileNames: 'index.cjs'
        }
      }
    }
  } as any,
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
