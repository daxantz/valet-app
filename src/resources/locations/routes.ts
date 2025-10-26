import { Router } from 'express'
import locationController from './controller'
import entranceRouter from '../entrances/routes'
import employeeRouter from '../employee/routes'
import authRouter from '../auth/routes'
import messageRouter from '../messaging/routes'

const router = Router()

// create and general routes
router.post('/create', locationController.makeLocation)
router.get('/', locationController.getLocations)

// 🔹 mount nested routers FIRST
router.use('/:locationId/messaging', messageRouter)
router.use('/:locationId/auth', authRouter)
router.use('/:locationId/employee', employeeRouter)
router.use('/:locationId/entrance', entranceRouter)

// 🔹 parameterized single routes AFTER nested ones
router.get('/:id', locationController.getSingleLocation)
router.put('/:id', locationController.updateLocation)
router.delete('/:id', locationController.removeLocation)

export default router
