import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

const certPath = '/home/anya/IdeaProjects/health_recommend/cert.pem'
const keyPath = '/home/anya/IdeaProjects/health_recommend/key.pem'
const hasCerts = fs.existsSync(certPath) && fs.existsSync(keyPath)

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        host: '0.0.0.0',
        https: hasCerts ? {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
        } : false,
    },
});
