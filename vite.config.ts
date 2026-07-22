import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/osrm/driving': {
        target: 'https://routing.openstreetmap.de/routed-car',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/osrm\/driving/, ''),
      },
      '/api/osrm/foot': {
        target: 'https://routing.openstreetmap.de/routed-foot',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/osrm\/foot/, ''),
      },
      '/api/osrm/cycling': {
        target: 'https://routing.openstreetmap.de/routed-bike',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/osrm\/cycling/, ''),
      },
    },
  },
})
