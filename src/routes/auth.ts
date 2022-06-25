import { Router } from 'express'
import auth from '../middleware/auth'

import { createToken, checkToken } from '../controllers/auth'

const router = Router()

router.post('/', createToken)

router.get('/', auth, checkToken)

export default router
