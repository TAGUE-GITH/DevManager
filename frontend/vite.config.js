import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // En developpement, les appels /api sont rediriges vers le backend Spring Boot
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
