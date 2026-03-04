import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err)

  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  })
}

export const corsMiddleware = (origin: string) => {
  return (_req: Request, _res: Response, next: NextFunction) => {
    _res.header('Access-Control-Allow-Origin', origin)
    _res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    _res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
  }
}
