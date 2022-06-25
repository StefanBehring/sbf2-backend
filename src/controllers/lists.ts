import { RequestHandler } from 'express'
import serverError from '../lib/serverError'
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
      let ausgangsdatum = new Date()
      ausgangsdatum.setDate(ausgangsdatum.getDate() - 1)
      let checkDay: number | string = ausgangsdatum.getDate()
      let checkMonth: number | string = ausgangsdatum.getMonth() + 1
      let checkYear = ausgangsdatum.getFullYear()
      if (checkDay < 10) {
        checkDay = `0${checkDay}`
      }
      if (checkMonth === 12) {
        checkMonth = '01'
        checkYear += 1
      } else if (checkMonth < 10) {
        checkMonth = `0${checkMonth}`
      }
      const checkDate = `${checkDay}.${checkMonth}.${checkYear}`

      const historisch = await Historisch.findOne({
        aktieId: aktie.id,
        datum: checkDate,
      })
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
      let ausgangsdatum = new Date()
      ausgangsdatum.setDate(ausgangsdatum.getDate() - 1)
      let checkDay: number | string = ausgangsdatum.getDate()
      let checkMonth: number | string = ausgangsdatum.getMonth() + 1
      let checkYear = ausgangsdatum.getFullYear()
      if (checkDay < 10) {
        checkDay = `0${checkDay}`
      }
      if (checkMonth === 12) {
        checkMonth = '01'
        checkYear += 1
      } else if (checkMonth < 10) {
        checkMonth = `0${checkMonth}`
      }
      const checkDate = `${checkDay}.${checkMonth}.${checkYear}`

      /*const historisch = await Historisch.findOne({
        aktieId: aktie.id,
        datum: checkDate,
      })
      if (historisch) {
        newEntry.wert = historisch.ende
      } else {
        console.warn('missing historisch for ' + aktie.unternehmen)
      }
      */

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
          listData.push(newEntry)
        }
      } else {
        console.warn('Missing dividends for ' + aktie.unternehmen)
      }
    }

    listData.sort(compareDividende)

    res.status(200).json({
      listData,
    })
  } catch (error) {
    serverError(error, next)
  }
}
