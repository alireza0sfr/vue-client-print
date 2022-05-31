/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
const path = require("path")
export default defineConfig({
  test: {
    setupFiles: ['./tests/config.ts'],
    environment: 'jsdom'
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/install.ts'),
      name: 'vcp',
      formats: ['umd'],
      fileName: (format) => `vcp.${format}.ts`
    },
    rollupOptions: {
      external: ['vue', 'vueI18n', 'vue-demi',],
      output: {
        exports: 'named',
        globals: {
          'vue-demi': 'VueDemi',
          'vue': 'Vue',
        }
      },
    }
  },
  plugins: [vue()],
  server: {
    port: 8080
  },
  resolve: {
    dedupe: [
      'vue'
    ],
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
