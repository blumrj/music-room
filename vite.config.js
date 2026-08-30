import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Reachable from outside the container when run via Docker; harmless
    // for bare local dev (just also exposes a Network URL).
    host: true,
    watch: {
      // Docker Desktop's file sharing on Windows doesn't always propagate
      // native FS events into the container, so bind-mount edits can go
      // unnoticed without polling. Only enabled when actually in Docker.
      usePolling: process.env.VITE_USE_POLLING === 'true',
    },
    // Mirrors the /api/* -> function redirect Netlify does in production,
    // so frontend code just fetches relative paths either way. The target
    // is the backend's Docker Compose service name when running there,
    // localhost otherwise.
    proxy: {
      '/api': process.env.VITE_API_PROXY_TARGET || 'http://localhost:8888',
    },
  },
})
