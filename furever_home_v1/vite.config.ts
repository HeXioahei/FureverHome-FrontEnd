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
      // 代理前台的 /api 接口到后端测试环境
      '/api': {
        target: 'http://p92df5b2.natappfree.cc',
        changeOrigin: true,
        secure: false,
        ws: true,
        // 前台接口路径：/api/xxx，后端也是 /api/xxx，所以不需要 rewrite
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('前台接口代理错误:', err)
          })
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('前台接口代理请求:', req.method, req.url, '->', proxyReq.path)
          })
        }
      },
      // 代理后台的 /admin 接口到后端测试环境
      '/admin': {
        target: 'http://p92df5b2.natappfree.cc',
        changeOrigin: true,
        secure: false,
        ws: true,
        // 后台接口路径：/admin/xxx，后端也是 /admin/xxx，所以不需要 rewrite
        // 确保代理所有 /admin 开头的请求
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('后台接口代理错误:', err)
          })
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('后台接口代理请求:', req.method, req.url, '->', proxyReq.path, '目标:', proxyReq.getHeader('host'))
          })
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('后台接口代理响应:', req.url, '状态码:', proxyRes.statusCode)
          })
        }
      }
    }
  }
})
