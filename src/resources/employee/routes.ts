import { Router } from 'express'
import employeeController from './controller'

const router = Router({ mergeParams: true })

// define routes
router.post('/', employeeController.makeEmployee)
// router.delete('/:id', entranceController.deleteEntrance)
router.get('/', employeeController.getEmployees)
// router.get('/:id', entranceController.getSingleEntrance)
// router.put('/:id', entranceController.updateEntrance)
export default router
