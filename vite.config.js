/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import libCss from 'vite-plugin-libcss';
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    setupFiles: ['./tests/config.ts'],
    environment: 'jsdom'
  },
  optimizeDeps: {
    exclude: ['vue-demi']
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/install.ts'),
      name: 'vcp',
      formats: ['es'],
      fileName: (format) => `vcp.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'vue-demi',],
      output: {
        exports: 'named',
        globals: {
          'vue-demi': 'VueDemi',
          'vue': 'Vue',
        }
      }
    },
  },
  plugins: [
    libCss(),
    vue({
      style: true,
      css: true
    }),
    vueI18n({
      include: path.resolve(__dirname, './src/locales/**.json'),
      globalSFCScope: true,
      compositionOnly: false,
    }),
  ],
  server: {
    port: 8080
  },
  resolve: {
    dedupe: ['vue'],
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
