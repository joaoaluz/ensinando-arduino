import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base relativa: o build funciona em qualquer subpasta (GitHub Pages, pen drive, etc.)
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
})
