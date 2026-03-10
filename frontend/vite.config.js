import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
var certPath = '/home/anya/IdeaProjects/health_recommend/cert.pem';
var keyPath = '/home/anya/IdeaProjects/health_recommend/key.pem';
var hasCerts = fs.existsSync(certPath) && fs.existsSync(keyPath);
var serverConfig = {
    port: 5173,
    host: '0.0.0.0',
};
if (hasCerts) {
    serverConfig.https = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
    };
}
export default defineConfig({
    plugins: [react()],
    server: serverConfig,
});
