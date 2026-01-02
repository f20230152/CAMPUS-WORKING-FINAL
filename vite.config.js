import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/CAMPUS-WORKING-FINAL/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'bundle.js',
        chunkFileNames: 'chunk-[hash].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  css: {
    modules: {
      generateScopedName: '[hash:base64:5]'
    }
  }
});

