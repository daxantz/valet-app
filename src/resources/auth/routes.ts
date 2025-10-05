import { Router } from 'express'
import authController from './controller'

const router = Router({ mergeParams: true })

// define routes
router.post('/login', authController.login)

export default router
