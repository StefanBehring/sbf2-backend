import { Router } from 'express'

import {
  getAktieTransaktionen,
  getAktieTransaktionenByAktieId,
  createAktieTransaktion,
} from '../controllers/aktie-transaktion'

const router = Router()

router.post('/', createAktieTransaktion)

router.get('/', getAktieTransaktionen)

router.get('/:aktieId', getAktieTransaktionenByAktieId)

// router.patch('/:userId', updateUser)

// router.delete('/:userId', deleteUser)

export default router
