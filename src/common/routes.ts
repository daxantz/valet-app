import { Router } from 'express'

const router: Router = Router()

// import routes
import loginRouter from '../resources/login/routes'
import locationRouter from '../resources/locations/routes'

// Higher level routes definition
router.use('/login', loginRouter)
router.use('/location', locationRouter)

export default router
