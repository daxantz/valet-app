import { Router } from 'express'
import { sendWelcomeMessage } from './controller'
const router = Router({ mergeParams: true })

router.post('/send-welcome', sendWelcomeMessage)

export default router
