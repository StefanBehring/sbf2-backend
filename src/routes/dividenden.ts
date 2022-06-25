import { Router } from 'express'

import { getDividenden } from '../controllers/dividenden'

const router = Router()

//router.post('/', createUser)

//router.get('/', getAktien)

router.get('/:aktieId', getDividenden)

// router.patch('/:userId', updateUser)

// router.delete('/:userId', deleteUser)

export default router
