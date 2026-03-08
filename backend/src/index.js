const express = require('express');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { config } = require('./config.js');
const analyzeRoutes = require('./routes.js');
const aiAgentRoutes = require('./ai-agent-routes.js');

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/analyze', analyzeRoutes);
app.use('/api/ai', aiAgentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

const PORT = config.port;
const IS_CLOUD_RUN = Boolean(process.env.K_SERVICE);

// Load HTTPS certificates
const certPath = path.join(__dirname, '../../cert.pem');
const keyPath = path.join(__dirname, '../../key.pem');

if (IS_CLOUD_RUN) {
  http.createServer(app).listen(PORT, '0.0.0.0', () => {
    console.info(`✅ Cloud Run HTTP server running on port ${PORT}`);
  });
} else {
  if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
    console.warn('⚠️ HTTPS certificates not found, starting HTTP server for local development');
    http.createServer(app).listen(PORT, '0.0.0.0', () => {
      console.info(`\n✅ HTTP Server running`);
      console.info(`📱 http://localhost:${PORT}`);
      console.info(`🌐 http://192.168.x.x:${PORT}\n`);
    });
  } else {
    const options = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };

    https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
      console.info(`\n✅ HTTPS Server running`);
      console.info(`📱 https://localhost:${PORT}`);
      console.info(`🌐 https://192.168.x.x:${PORT}\n`);
    });
  }
}
