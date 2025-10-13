import { Router } from 'express'
import entranceController from './controller'
import carRouter from '../cars/routes'
const router = Router({ mergeParams: true })

// define routes
router.post('/', entranceController.makeEntrance)
router.delete('/:id', entranceController.deleteEntrance)
router.get('/', entranceController.getEntrancesByLocation)
router.get('/:id', entranceController.getSingleEntrance)
router.put('/:id', entranceController.updateEntrance)
router.use('/:entranceId/car', carRouter)
export default router
