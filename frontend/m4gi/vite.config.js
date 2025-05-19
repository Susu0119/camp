// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/web/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/web': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },

      // 예시: '/api'로만 호출하고 싶으면
      // '/api': {
      //   target: 'http://localhost:8080',
      //   changeOrigin: true,
      // },
    }
  }
});
