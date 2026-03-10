const dotenv = require('dotenv');

dotenv.config();

const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : '*';

const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY,
  gcpProjectId: process.env.GCP_PROJECT_ID,
  corsOrigin,
};

module.exports = { config };
