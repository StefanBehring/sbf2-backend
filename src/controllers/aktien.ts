import { RequestHandler } from 'express'
import serverError from '../lib/serverError'
const Aktien = require('../models/Aktien')

export const getAktien: RequestHandler = async (req, res, next) => {
  try {
    const aktien = await Aktien.find()
    if (!aktien) {
      console.error('Aktien do not exist')
      return next({ status: 404, message: 'Aktien do not exist' })
    }

    res.status(200).json({
      aktien,
    })
  } catch (error) {
    serverError(error, next)
  }
}

export const getAktieById: RequestHandler = async (req, res, next) => {
  const { aktieId } = req.params

  try {
    const aktie = await Aktien.findById(aktieId)
    if (!aktie) {
      console.error('Aktie does not exist')
      return next({ status: 404, message: 'Aktie does not exist' })
    }

    res.status(200).json({
      id: aktie._id,
      unternehmen: aktie.unternehmen,
      isin: aktie.isin,
      url: aktie.url,
      urlBilanzGuv: aktie.urlBilanzGuv,
      urlDividende: aktie.urlDividende,
      urlHistorisch: aktie.urlHistorisch,
    })
  } catch (error) {
    serverError(error, next)
  }
}

export const getAktieByIsin: RequestHandler = async (req, res, next) => {
  const { isin } = req.params

  console.log('GetAktieByIsin: ' + isin)

  try {
    const aktie = await Aktien.findOne({ isin: isin })
    if (!aktie) {
      console.error('Aktie does not exist')
      return next({ status: 404, message: 'Aktie does not exist' })
    }

    console.log(aktie)

    res.status(200).json({
      id: aktie._id,
      unternehmen: aktie.unternehmen,
      isin: aktie.isin,
      url: aktie.url,
      urlBilanzGuv: aktie.urlBilanzGuv,
      urlDividende: aktie.urlDividende,
      urlHistorisch: aktie.urlHistorisch,
    })
  } catch (error) {
    serverError(error, next)
  }
}
