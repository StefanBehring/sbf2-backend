import { RequestHandler } from 'express'
import serverError from '../lib/serverError'
const Historisch = require('../models/Historisch')

export const getHistorisch: RequestHandler = async (req, res, next) => {
  const { aktieId } = req.params

  try {
    const historisch = await Historisch.find({ aktieId })
    if (!historisch) {
      console.error('No historisch data found')
      return next({ status: 404, message: 'No historisch data found' })
    }

    res.status(200).json({
      historisch,
    })
  } catch (error) {
    serverError(error, next)
  }
}
