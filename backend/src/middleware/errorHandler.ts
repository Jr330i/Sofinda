import { Request, Response, NextFunction } from 'express'

export interface APIError extends Error {
  statusCode?: number
  code?: string
}

export const errorHandler = (
  err: APIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  
  console.error(`Error ${statusCode}: ${message}`)
  console.error(err.stack)

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    },
    timestamp: new Date().toISOString()
  })
}