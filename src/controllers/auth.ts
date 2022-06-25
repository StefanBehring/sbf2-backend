import { RequestHandler } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const User = require('../models/User')
import serverError from '../lib/serverError'

const { JWT_SECRET } = process.env

export const createToken: RequestHandler = async (req, res, next) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })

    if (!user) {
      const error = {
        message: 'Incorrect data! Either username or password are wrong.',
      }
      return next({ status: 400, message: error.message })
    }

    bcrypt.compare(password, user.password, (errCompare, resCompare) => {
      if (errCompare) {
        console.error(errCompare)
        return next({
          status: 400,
          message: 'Incorrect data! Either username or password are wrong.',
        })
      }
      if (resCompare) {
        const payload = {
          user: {
            id: user._id,
          },
        }

        // TODO: expiration to 3600
        jwt.sign(
          payload,
          JWT_SECRET!,
          { expiresIn: 360000 },
          (errJWT, token) => {
            if (errJWT) {
              console.error(errJWT)
              return next({ status: 400, message: errJWT.message })
            }
            res.status(200).json({ token, isUserAdmin: user.isAdmin })
          }
        )
      } else {
        const error = {
          message: 'Incorrect data! Either username or password are wrong.',
        }
        console.error(error.message)
        return next({ status: 400, message: error.message })
      }
    })
  } catch (error) {
    serverError(error, next)
  }
}

export const checkToken: RequestHandler = async (req, res, next) => {
  try {
    const userId = res.locals.user.id
    const user = await User.findById(userId).select('-password')
    res.status(200).json(user)
  } catch (error) {
    serverError(error, next)
  }
}
