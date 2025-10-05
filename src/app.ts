import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import routes from './common/routes'
import unknownEndpoint from './middlewares/unknownEndpoint'
import cookieParser from 'cookie-parser'
// to use env variables
import './common/env'

const app: Application = express()

// middleware
app.disable('x-powered-by')
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
)
app.use(compression())
app.use(
  express.urlencoded({
    extended: true,
    limit: process.env.REQUEST_LIMIT || '100kb',
  }),
)
app.use(express.json())
app.use(cookieParser())

// health check
// app.get('/', (req: Request, res: Response) => {
//   res.status(200).json({
//     'health-check': "working! let's build something awesome.",
//   })
// })

app.get('/health', async (req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

app.use('/v1', routes)

// Handle unknown endpoints
app.use('*', unknownEndpoint)

app.use((err, req: Request, res: Response) => {
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})

export default app
