import { Router } from 'express'
import carController from './controller'
import { upload } from '../../services/aws'

const router = Router({ mergeParams: true })

// define routes
router.get('/', carController.getCars)
router.post('/', upload.array('images', 4), carController.createCar)
router.delete('/:id', carController.removeCar)
// router.get('/', entranceController.getEntrancesByLocation)
router.get('/:id', carController.getSingleCar)
// router.put('/:id', entranceController.updateEntrance)
export default router
