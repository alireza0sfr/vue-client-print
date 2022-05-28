import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

// https://vitejs.dev/config/
const path = require("path")
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/install.ts'),
      name: 'vcp',
      fileName: (format) => `vcp.${format}.ts`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          vcp: 'Vcp'
        }
      }
    },
  },
  plugins: [
    vue(),
    vueI18n({
      include: path.resolve(__dirname, 'src/assets/translations.ts'),
      globalSFCScope: true,
      compositionOnly: false,
    })
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
