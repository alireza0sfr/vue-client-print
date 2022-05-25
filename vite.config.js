import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
const path = require("path")
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/install.ts'),
      name: 'vcp',
      fileName: (format) => `vcp.${format}.ts`,
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue'
          }
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
