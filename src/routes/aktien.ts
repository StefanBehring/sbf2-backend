import { Router } from 'express'

import { getAktien, getAktieById, getAktieByIsin } from '../controllers/aktien'

const router = Router()

//router.post('/', createUser)

router.get('/', getAktien)

router.get('/:aktieId', getAktieById)

router.get('/isin/:isin', getAktieByIsin)

// router.patch('/:userId', updateUser)

// router.delete('/:userId', deleteUser)

export default router
