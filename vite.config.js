import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/bms'),
      },
      '/upload': {
        target: 'http://localhost:8080',  // 后端服务器地址
        changeOrigin: true
      }
    },
  },
})
