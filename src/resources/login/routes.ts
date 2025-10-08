import { Router } from 'express'
import loginController from './controller'
const router = Router()

router.post('/', loginController.loginLocation)

export default router
