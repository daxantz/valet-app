import { Router } from 'express'

const router: Router = Router()

// import routes
import locationRouter from '../resources/locations/routes'
import entranceRouter from '../resources/entrances/routes'
// Higher level routes definition
router.use('/location', locationRouter)
router.use('/entrance', entranceRouter)
export default router
