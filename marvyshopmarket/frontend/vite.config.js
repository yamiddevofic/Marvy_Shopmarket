import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:3333',  // Redirige las solicitudes de API a Flask
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
})

