import { Request, Response, NextFunction } from 'express'

import jwt from 'jsonwebtoken'

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token')

  if (!token) {
    return res.status(401).json({ message: 'Not authorized!' })
  }

  try {
    const { JWT_SECRET } = process.env
    const decoded = jwt.verify(token, JWT_SECRET!)

    res.locals.user = (<any>decoded).user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token is invalid!' })
  }
}

export default auth
