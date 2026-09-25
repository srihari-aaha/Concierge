import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        try {
          fs.copyFileSync(
            path.resolve('dist/index.html'),
            path.resolve('dist/404.html')
          )
        } catch (_) {}
      }
    }
  ],
  base: '/Concierge/',
  server: {
    host: true,
    port: 5173
  }
})
