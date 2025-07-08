// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Carga .env, .env.local y .env.[mode] (solo claves sin prefijo VITE_)
  const env = loadEnv(mode, process.cwd(), '')

  /** Valor por defecto para cuando corras sin Docker Compose
   *  y tengas el backend en tu máquina local.
   */
  const backend = env.VITE_API_URL || 'http://127.0.0.1:3333'

  return {
    plugins: [react()],

    server: {
      host: true,          // 0.0.0.0 → accesible desde el host
      port: 5173,

      // Hot-reload fiable en Docker Desktop
      watch: {
        usePolling: true,
        interval: 300
      },

      // Proxy solo activo en modo dev
      proxy: {
        '/api': {
          target: backend,
          changeOrigin: true,
          secure: false
        },
        '/upload': {
          target: backend,
          changeOrigin: true,
          secure: false
        }
      }
    },

    // PostCSS (Tailwind, autoprefixer, etc.)
    css: {
      postcss: './postcss.config.js'
    }
  }
})
