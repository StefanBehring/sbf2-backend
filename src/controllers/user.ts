import { RequestHandler } from 'express'
import bcrypt from 'bcryptjs'
import serverError from '../lib/serverError'
const User = require('../models/User')

export const createUser: RequestHandler = async (req, res, next) => {
  const { username, email, password } = req.body

  if (username === '' || email === '' || password === '') {
    const error = { message: 'Information missing.' }
    return next({ status: 400, message: error.message })
  }

  try {
    let userTest = await User.findOne({ username })
    if (userTest) {
      const errorUser = { message: 'Username/E-Mail already exists' }
      return next({ status: 400, message: errorUser.message })
    }

    let emailTest = await User.findOne({ email })
    if (emailTest) {
      const errorEmail = { message: 'Username/E-Mail already exists' }
      return next({ status: 400, message: errorEmail.message })
    }
  } catch (err) {
    console.error(err)
    const error = { message: 'Unknown error!' }
    return next({ status: 400, message: error.message })
  }

  const newUser = {
    username,
    email,
    password,
  }

  const salt = await bcrypt.genSalt(10)
  newUser.password = await bcrypt.hash(password, salt)

  User.create(newUser)
    .then((user: { _id: string; username: string; email: string }) =>
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
      })
    )
    .catch(next)
}

export const getUser: RequestHandler = async (req, res, next) => {
  const { userId } = req.params

  try {
    const user = await User.findById(userId)
    if (!user) {
      console.error('User does not exist')
      return next({ status: 404, message: 'User does not exist' })
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
    })
  } catch (error) {
    serverError(error, next)
  }
}

export const updateUser: RequestHandler<{ userId: string }> = async (
  req,
  res,
  next
) => {
  const { userId } = req.params
  const { password } = req.body

  if (!password) {
    const error = { message: 'Information missing.' }
    return next({ status: 400, message: error.message })
  }

  const salt = await bcrypt.genSalt(10)
  const newPassword = await bcrypt.hash(password, salt)

  User.findByIdAndUpdate(userId, { password: newPassword }, { new: true })
    .then((user: { _id: string; username: string; email: string }) => {
      if (!user) {
        throw new Error('Could not change the password')
      }
      res.status(200).json({
        id: user._id,
        username: user.username,
        email: user.email,
      })
    })
    .catch((error: { message: string }) =>
      next({ status: 404, message: error.message || 'Document not found' })
    )
}

export const deleteUser: RequestHandler<{ userId: string }> = async (
  req,
  res,
  next
) => {
  const { userId } = req.params

  try {
    const user = await User.findByIdAndDelete(userId)
    if (!user) {
      console.error('User does not exist')
      return next({ status: 404, message: 'User does not exist' })
    }
    res.status(200).json(user)
  } catch (error) {
    serverError(error, next)
  }
}
