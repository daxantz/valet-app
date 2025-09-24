import { Router } from 'express'
import locationController from './controller'

const router = Router()

// define routes
router.route('/').post(locationController.makeLocation)

export default router
