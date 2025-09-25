import { Router } from 'express'
import entranceController from './controller'

const router = Router()

// define routes
router.post('/locations/:locationId/entrance', entranceController.makeEntrance)
// router.delete('/:id', locationController.removeLocation)
// router.get('/', locationController.getLocations)
// router.get('/:id', locationController.getSingleLocation)
// router.put('/:id', locationController.updateLocation)
export default router
