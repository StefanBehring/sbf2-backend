import { RequestHandler } from 'express'
import serverError from '../lib/serverError'
const Dividenden = require('../models/Dividenden')

export const getDividenden: RequestHandler = async (req, res, next) => {
  const { aktieId } = req.params

  try {
    const dividenden = await Dividenden.find({ aktieId })
    if (!dividenden) {
      console.error('No dividends found')
      return next({ status: 404, message: 'No dividends found' })
    }

    res.status(200).json({
      dividenden,
    })
  } catch (error) {
    serverError(error, next)
  }
}
