import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig(() => ({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'staticwebapp.config.json',
          dest: '.'
        }
      ]
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: [
            'react',
            'react-dom',
            'react-router-dom'
          ],
          // removed fluent chunk (replaced by local shims/icons)
          motion: [
            'framer-motion'
          ]
        }
      }
    }
  }
}));
