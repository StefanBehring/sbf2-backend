import { Request, Response, NextFunction } from 'express'

export default function errorHandler(
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.error(error)
  const statusCode = error.status || 500
  response.status(statusCode).json(error)
}
