import express from 'express'
import cors from 'cors'
import { config, validateConfig } from './config/index.js'
import { errorHandler } from './middleware/index.js'
import analyzeRoutes from './routes/analyze.js'

// Validate configuration
validateConfig()

const app = express()

// Middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
)

// Routes
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/analyze', analyzeRoutes)

// Error handling
app.use(errorHandler)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  })
})

const PORT = config.port
app.listen(PORT, () => {
  console.info(
    `Server running on port ${PORT} in ${config.nodeEnv} mode`
  )
  console.info(`CORS origin: ${config.corsOrigin}`)
})

export default app
