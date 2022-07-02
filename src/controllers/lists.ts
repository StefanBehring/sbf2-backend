import { RequestHandler } from 'express'
import serverError from '../lib/serverError'
import compareDatumStringDESC from '../lib/compateDatumStringDESC'
const Aktien = require('../models/Aktien')
const Dividenden = require('../models/Dividenden')
const Historisch = require('../models/Historisch')

type CurrentDividendRate = {
  unternehmen: string
  isin: string
  wert: number
  dividende: number
  rate: number
}

type DividendeRise = {
  unternehmen: string
  isin: string
  dividenden: {
    jahr: number
    dividende: number
    waehrung: string
  }[]
  currentPrice: number
  isRiser: boolean
}

function compare(a: CurrentDividendRate, b: CurrentDividendRate) {
  if (a.rate < b.rate) {
    return 1
  }
  if (a.rate > b.rate) {
    return -1
  }
  // a muss gleich b sein
  return 0
}

function compareRiser(a: DividendeRise, b: DividendeRise) {
  if (a.isRiser && !b.isRiser) {
    return -1
  }
  if (!a.isRiser && b.isRiser) {
    return 1
  }
  return 0
}

function compareDividende(a: CurrentDividendRate, b: CurrentDividendRate) {
  if (a.dividende < b.dividende) {
    return 1
  }
  if (a.dividende > b.dividende) {
    return -1
  }
  // a muss gleich b sein
  return 0
}

export const getCurrentDividendsRate: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const aktien = await Aktien.find()
    if (!aktien) {
      console.error('Aktien do not exist')
      return next({ status: 404, message: 'Aktien do not exist' })
    }

    const listData: CurrentDividendRate[] = []

    for (const aktie of aktien) {
      const newEntry: CurrentDividendRate = {
        unternehmen: aktie.unternehmen,
        isin: aktie.isin,
        wert: 0,
        dividende: 0,
        rate: 0,
      }

      const historisch = await Historisch.findOne({
        aktieId: aktie.id,
        //datum: checkDate,
      })
        .sort({ datum: 'desc' })
        .limit(1)
      if (historisch) {
        newEntry.wert = historisch.ende
      } else {
        console.warn('missing historisch for ' + aktie.unternehmen)
      }

      const dividenden = await Dividenden.find({ aktieId: aktie.id })
        .sort({
          jahr: -1,
        })
        .limit(1)
      if (dividenden.length > 0) {
        newEntry.dividende = dividenden[0].wert
        newEntry.rate = newEntry.dividende / newEntry.wert
        if (newEntry.wert > 0) {
          listData.push(newEntry)
        }
      } else {
        console.warn('Missing dividends for ' + aktie.unternehmen)
      }
    }

    listData.sort(compare)

    res.status(200).json({
      listData,
    })
  } catch (error) {
    serverError(error, next)
  }
}

export const getCurrentDividendsRateAktie: RequestHandler = async (
  req,
  res,
  next
) => {
  const { aktieId } = req.params

  try {
    const aktie = await Aktien.findById(aktieId)

    if (!aktie) {
      console.error('Aktie does not exist')
      return next({ status: 404, message: 'Aktie does not exist' })
    }

    const newEntry: CurrentDividendRate = {
      unternehmen: aktie.unternehmen,
      isin: aktie.isin,
      wert: 0,
      dividende: 0,
      rate: 0,
    }

    const historisch = await Historisch.findOne({
      aktieId: aktie.id,
      //datum: checkDate,
    })
      .sort({ datum: 'desc' })
      .limit(1)
    if (historisch) {
      newEntry.wert = historisch.ende
    } else {
      console.warn('missing historisch for ' + aktie.unternehmen)
    }

    const dividenden = await Dividenden.find({ aktieId: aktie.id })
      .sort({
        jahr: -1,
      })
      .limit(1)
    if (dividenden.length > 0) {
      newEntry.dividende = dividenden[0].wert
      newEntry.rate = newEntry.dividende / newEntry.wert
    } else {
      console.warn('Missing dividends for ' + aktie.unternehmen)
    }

    res.status(200).json({
      newEntry,
    })
  } catch (error) {
    serverError(error, next)
  }
}

export const getConstantDividendRises: RequestHandler = async (
  req,
  res,
  next
) => {
  console.log('(getConstantDividendRises) running')
  try {
    const aktien = await Aktien.find()

    if (!aktien) {
      console.error('Aktien do not exist')
      return next({ status: 404, message: 'Aktien do not exist' })
    }

    const listData: DividendeRise[] = []

    for (const aktie of aktien) {
      const newEntry: DividendeRise = {
        unternehmen: aktie.unternehmen,
        isin: aktie.isin,
        dividenden: [],
        currentPrice: 0,
        isRiser: false,
      }

      const dividenden: {
        _id: string
        aktieId: string
        wert: number
        waehrung: string
        jahr: number
        __v: number
      }[] = await Dividenden.find({ aktieId: aktie.id })
        .sort({ jahr: -1 })
        .limit(10)

      if (dividenden.length === 10) {
        newEntry.dividenden = dividenden.map(el => {
          return {
            jahr: el.jahr,
            dividende: el.wert,
            waehrung: el.waehrung,
          }
        })

        let isRiser = true

        for (let i = 0; i < newEntry.dividenden.length - 1; i++) {
          if (
            newEntry.dividenden[i].dividende <=
              newEntry.dividenden[i + 1].dividende ||
            newEntry.dividenden[i].dividende <= 0
          ) {
            isRiser = false
            break
          }
        }

        newEntry.isRiser = isRiser
      }

      if (newEntry.isRiser) {
        const historisch = await Historisch.find({ aktieId: aktie.id })
          .sort({ datum: -1 })
          .limit(1)

        if (historisch.length > 0) {
          newEntry.currentPrice = historisch[0].ende
        }

        listData.push(newEntry)
      }
    }

    listData.sort(compareRiser)

    res.header('Access-Control-Allow-Origin', '*')
    res.status(200).json({
      listData,
    })
  } catch (error) {
    serverError(error, next)
  }
}

export const getLast10YearsDividendsRate: RequestHandler = async (
  req,
  res,
  next
) => {
  console.log('(getLast10YearsDividendsRate) running')
  try {
    const aktien = await Aktien.find()
    if (!aktien) {
      console.error('Aktien do not exist')
      return next({ status: 404, message: 'Aktien do not exist' })
    }

    const listData: CurrentDividendRate[] = []

    for (const aktie of aktien) {
      console.log('Tracking: ' + aktie.unternehmen)
      const newEntry: CurrentDividendRate = {
        unternehmen: aktie.unternehmen,
        isin: aktie.isin,
        wert: 0,
        dividende: 0,
        rate: 0,
      }

      const historisch = await Historisch.findOne({
        aktieId: aktie.id,
      })
        .sort({ datum: 'desc' })
        .limit(1)
      if (historisch) {
        newEntry.wert = historisch.ende
      } else {
        console.warn('missing historisch for ' + aktie.unternehmen)
      }

      const dividenden = await Dividenden.find({ aktieId: aktie.id })
        .sort({
          jahr: -1,
        })
        .limit(10)
      if (dividenden.length > 0) {
        for (const divi of dividenden) {
          if (divi.wert) {
            newEntry.dividende += divi.wert
          }
        }
        newEntry.rate = newEntry.dividende / newEntry.wert
        if (newEntry.wert > 0) {
          listData.push(newEntry)
        } else {
          console.log('Did not add to listData')
        }
      } else {
        console.warn('Missing dividends for ' + aktie.unternehmen)
      }
    }

    listData.sort(compare)

    res.status(200).json({
      listData,
    })
  } catch (error) {
    serverError(error, next)
  }
}

export const getLast10YearsDividendsRateAktie: RequestHandler = async (
  req,
  res,
  next
) => {
  console.log('(getLast10YearsDividendsRate) running')
  try {
    const { aktieId } = req.params

    const aktie = await Aktien.findById(aktieId)
    if (!aktie) {
      console.error('Aktie does not exist')
      return next({ status: 404, message: 'Aktie does not exist' })
    }

    console.log('Tracking: ' + aktie.unternehmen)
    const newEntry: CurrentDividendRate = {
      unternehmen: aktie.unternehmen,
      isin: aktie.isin,
      wert: 0,
      dividende: 0,
      rate: 0,
    }

    const historisch = await Historisch.findOne({
      aktieId: aktie.id,
    })
      .sort({ datum: 'desc' })
      .limit(1)
    if (historisch) {
      newEntry.wert = historisch.ende
    } else {
      console.warn('missing historisch for ' + aktie.unternehmen)
    }

    const dividenden = await Dividenden.find({ aktieId: aktie.id })
      .sort({
        jahr: -1,
      })
      .limit(10)
    if (dividenden.length > 0) {
      for (const divi of dividenden) {
        if (divi.wert) {
          newEntry.dividende += divi.wert
        }
      }
      newEntry.rate = newEntry.dividende / newEntry.wert
    } else {
      console.warn('Missing dividends for ' + aktie.unternehmen)
    }

    res.status(200).json({
      newEntry,
    })
  } catch (error) {
    serverError(error, next)
  }
}
