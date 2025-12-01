import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      // 代理前端的 /api 到后端测试环境，避免开发时的 CORS 问题
      '/api': {
        target: 'http://p92df5b2.natappfree.cc',
        changeOrigin: true
      }
    }
  }
})
