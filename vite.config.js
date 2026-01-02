import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Support dynamic base path for GitHub Pages
// For local dev: base = '/'
// For GitHub Pages: base = '/repository-name/'
const base = process.env.VITE_BASE_PATH || process.env.BASE_PATH || '/'

export default defineConfig({
  plugins: [react()],
  base: base,
  build: {
    outDir: 'dist',
  },
})
