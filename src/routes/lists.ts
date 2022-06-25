import { Router } from 'express'

import {
  getCurrentDividendsRate,
  getConstantDividendRises,
  getLast10YearsDividendsRate,
  getCurrentDividendsRateAktie,
  getLast10YearsDividendsRateAktie,
} from '../controllers/lists'

const router = Router()

//router.post('/', createUser)

//router.get('/', getAktien)

router.get('/current-dividends-rate', getCurrentDividendsRate)

router.get(
  '/current-dividends-rate-aktie/:aktieId',
  getCurrentDividendsRateAktie
)

router.get('/constant-dividenden-rises', getConstantDividendRises)

router.get('/last-10-years-dividends-rate', getLast10YearsDividendsRate)

router.get(
  '/last-10-years-dividends-rate-aktie/:aktieId',
  getLast10YearsDividendsRateAktie
)

// router.patch('/:userId', updateUser)

// router.delete('/:userId', deleteUser)

export default router
