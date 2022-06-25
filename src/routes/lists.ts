import { Router } from 'express'

import {
  getCurrentDividendsRate,
  getLast10YearsDividendsRate,
} from '../controllers/lists'

const router = Router()

//router.post('/', createUser)

//router.get('/', getAktien)

router.get('/current-dividends-rate', getCurrentDividendsRate)

router.get('/last-10-years-dividends-rate', getLast10YearsDividendsRate)

// router.patch('/:userId', updateUser)

// router.delete('/:userId', deleteUser)

export default router
