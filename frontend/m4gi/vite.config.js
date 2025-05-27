import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  appType: 'spa',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/web': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/web/admin': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/web/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
  },
});