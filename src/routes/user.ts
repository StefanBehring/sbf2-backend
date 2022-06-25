import { Router } from 'express'

import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/user'

const router = Router()

router.post('/', createUser)

router.get('/:userId', getUser)

router.patch('/:userId', updateUser)

router.delete('/:userId', deleteUser)

export default router
