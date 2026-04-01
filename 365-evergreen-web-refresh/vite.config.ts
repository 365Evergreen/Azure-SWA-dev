import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig(() => ({
  // Use root base for both dev and production builds
  base: '/',
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
          fluent: [
            '@fluentui/react-components'
          ],
          motion: [
            'framer-motion'
          ]
        }
      }
    }
  }
}));
