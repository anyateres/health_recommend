import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    https: {
      key: fs.readFileSync('/home/anya/IdeaProjects/health_recommend/key.pem'),
      cert: fs.readFileSync('/home/anya/IdeaProjects/health_recommend/cert.pem'),
    },
  },
})
