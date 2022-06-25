import { NextFunction } from 'express-serve-static-core'

const serverError = (error: any, next: NextFunction) => {
  console.error(error)
  return next({ message: 'Server error!' })
}

export default serverError
