import { RequestHandler } from 'express'
import compareDatumStringASC from '../lib/compareDatumStringASC'
import serverError from '../lib/serverError'
const Historisch = require('../models/Historisch')

type historischObj = {
  aktieId: string
  datum: string
  start: number
  ende: number
  hoch: number
  tief: number
  volumen: number
}

export const getHistorisch: RequestHandler = async (req, res, next) => {
  const { aktieId } = req.params

  try {
    const historisch = await Historisch.find({ aktieId })
    if (!historisch) {
      console.error('No historisch data found')
      return next({ status: 404, message: 'No historisch data found' })
    }

    historisch.sort((a: historischObj, b: historischObj) =>
      compareDatumStringASC(a.datum, b.datum)
    )

    res.header('Access-Control-Allow-Origin', '*')
    res.status(200).json({
      historisch,
    })
  } catch (error) {
    serverError(error, next)
  }
}
