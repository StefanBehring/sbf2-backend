import { Router } from 'express'

import { getHistorisch } from '../controllers/historisch'

const router = Router()

//router.post('/', createUser)

//router.get('/', getAktien)

router.get('/:aktieId', getHistorisch)

// router.patch('/:userId', updateUser)

// router.delete('/:userId', deleteUser)

export default router
