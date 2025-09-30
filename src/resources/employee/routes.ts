import { Router } from 'express'
import employeeController from './controller'

const router = Router({ mergeParams: true })

// define routes
router.post('/', employeeController.makeEmployee)
router.delete('/:employeeId', employeeController.removeEmployee)
router.get('/', employeeController.getEmployees)
router.get('/:employeeId', employeeController.getSingleEmployee)
// router.put('/:id', entranceController.updateEntrance)
export default router
