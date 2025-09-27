import { Router } from 'express'

const router: Router = Router()

// import routes
import locationRouter from '../resources/locations/routes'

// Higher level routes definition
router.use('/location', locationRouter)

export default router
