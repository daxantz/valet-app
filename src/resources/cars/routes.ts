import { Router } from 'express'
import carController from './controller'

const router = Router({ mergeParams: true })

// define routes
router.get('/', carController.getCars)
// router.get('/', carController.getCars)
router.delete('/:id', carController.removeCar)
// router.get('/', entranceController.getEntrancesByLocation)
// router.get('/:id', entranceController.getSingleEntrance)
// router.put('/:id', entranceController.updateEntrance)
export default router
