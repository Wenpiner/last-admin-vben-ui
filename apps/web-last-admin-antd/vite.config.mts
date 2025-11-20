import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api/sys-api': {
            target: 'http://localhost:18889',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/sys-api/, ''),
            ws: true,
          },
          '/api/iras-api': {
            target: 'http://localhost:8891',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/iras-api/, ''),
            ws: true,
          },
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api',
            ws: true,
          },
        },
      },
    },
  };
});
