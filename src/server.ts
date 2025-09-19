import app from './app'
import * as os from 'os'
import logger from './common/logger'

// to use env variables
import './common/env'

const PORT = process.env.PORT || 3000

app.listen(3000, () => {
  logger.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port ${PORT}}`)
})
