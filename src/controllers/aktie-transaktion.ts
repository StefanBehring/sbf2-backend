import { ObjectId } from 'mongoose'
import { RequestHandler } from 'express'
import serverError from '../lib/serverError'

const Aktien = require('../models/Aktien')
const AktieTransaktion = require('../models/AktieTransaktion')

type AktieTransaktionBody = {
  aktieId: ObjectId | string
  anzahl: number
  preis: number
  datum: string
  istKauf: boolean
}

export const createAktieTransaktion: RequestHandler = async (
  req,
  res,
  next
) => {
  const { aktieId, anzahl, preis, datum, istKauf }: AktieTransaktionBody =
    req.body

  if (
    aktieId === '' ||
    !Number.isInteger(anzahl) ||
    preis === null ||
    datum === '' ||
    !(istKauf === true || istKauf === false)
  ) {
    const error = { message: 'Information missing.' }
    return next({ status: 400, message: error.message })
  }

  const aktie = await Aktien.findById(aktieId)
  if (!aktie) {
    console.error('Aktie does not exist')
    return next({ status: 404, message: 'Aktie does not exist' })
  }

  const newAktieTransaktion = {
    aktieId,
    anzahl,
    preis,
    datum,
    istKauf,
  }

  try {
    const aktieTransaktionResult = await AktieTransaktion.create(
      newAktieTransaktion
    )
    return res.status(201).json({
      aktieTransaktionResult,
    })
  } catch (error) {
    serverError(error, next)
  }
}

export const getAktieTransaktionen: RequestHandler = async (req, res, next) => {
  try {
    const aktieTransaktionen = await AktieTransaktion.find()
    if (!aktieTransaktionen) {
      console.error('AktieTransaktion do not exist')
      return next({ status: 404, message: 'AktieTransaktion do not exist' })
    }

    res.status(200).json({
      data: aktieTransaktionen,
    })
  } catch (error) {
    serverError(error, next)
  }
}

export const getAktieTransaktionenByAktieId: RequestHandler = async (
  req,
  res,
  next
) => {
  const { aktieId } = req.params

  try {
    const aktieTransaktionen = await AktieTransaktion.find({ aktieId: aktieId })
    if (!aktieTransaktionen) {
      console.error('AktieTransaktion do not exist')
      return next({ status: 404, message: 'AktieTransaktion do not exist' })
    }

    res.status(200).json({
      data: aktieTransaktionen,
    })
  } catch (error) {
    serverError(error, next)
  }
}
