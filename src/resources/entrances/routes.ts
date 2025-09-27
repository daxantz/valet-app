import { Router } from 'express'
import entranceController from './controller'

const router = Router({ mergeParams: true })

// define routes
router.post('/', entranceController.makeEntrance)
// router.delete('/:id', locationController.removeLocation)
router.get('/', entranceController.getEntrancesByLocation)
// router.get('/:id', locationController.getSingleLocation)
// router.put('/:id', locationController.updateLocation)
export default router
