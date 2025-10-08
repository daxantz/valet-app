import { Router } from 'express'
import authController from './controller'
import verifyLocationToken from '../../middlewares/verifyLocationToken'

const router = Router({ mergeParams: true })

// define routes
router.post('/login', verifyLocationToken, authController.login)

export default router
