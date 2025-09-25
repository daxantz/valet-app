import { Router } from 'express'
import locationController from './controller'

const router = Router()

// define routes
router.route('/create').post(locationController.makeLocation)
router.delete('/:id', locationController.removeLocation)
router.get('/', locationController.getLocations)
router.get('/:id', locationController.getSingleLocation)
export default router
