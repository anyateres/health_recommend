import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const certPath = '/home/anya/IdeaProjects/health_recommend/cert.pem'
const keyPath = '/home/anya/IdeaProjects/health_recommend/key.pem'
const hasCerts = fs.existsSync(certPath) && fs.existsSync(keyPath)

const serverConfig: any = {
  port: 5173,
  host: '0.0.0.0',
}

if (hasCerts) {
  serverConfig.https = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  }
}

export default defineConfig({
  plugins: [react()],
  server: serverConfig,
})
