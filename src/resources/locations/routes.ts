import { Router } from 'express'
import locationController from './controller'
import entranceRouter from '../entrances/routes'
const router = Router()

// define routes
router.route('/create').post(locationController.makeLocation)
router.delete('/:id', locationController.removeLocation)
router.get('/', locationController.getLocations)
router.get('/:id', locationController.getSingleLocation)
router.put('/:id', locationController.updateLocation)

router.use('/:locationId/entrance', entranceRouter)
export default router
