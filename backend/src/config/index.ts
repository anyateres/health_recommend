import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY,
  gcpProjectId: process.env.GCP_PROJECT_ID,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}

export function validateConfig() {
  if (!config.geminiApiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required')
  }
}
