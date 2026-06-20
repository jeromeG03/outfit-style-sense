import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts: [
          'outfit-style-sense-production-974e.up.railway.app',
          '.railway.app',
          '.up.railway.app',
          'localhost'
        ],
      },
      preview: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts: [
          'outfit-style-sense-production-974e.up.railway.app',
          '.railway.app',
          '.up.railway.app',
          'localhost'
        ],
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
