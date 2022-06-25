import express from 'express'
import morgan from 'morgan'
import path from 'path'
import connectDatabase from './lib/connectDatabase'
import errorHandler from './middleware/errorHandler'
import dotenv from 'dotenv'
dotenv.config()

import userRoutes from './routes/user'
import authRoutes from './routes/auth'
import aktieTransaktionRoutes from './routes/aktien-transaktion'
import aktieRoutes from './routes/aktien'
import dividendenRoutes from './routes/dividenden'
import historischRoutes from './routes/historisch'
import listsRoutes from './routes/lists'

const app = express()

const { PORT, MONGODB_URI } = process.env

if (typeof MONGODB_URI !== 'string') {
  console.error('Could not start the server:\nMONGODB_URI is not a string')
} else {
  connectDatabase(MONGODB_URI)
  startServer()
}

function startServer() {
  app.use(express.json())
  app.use(morgan('common'))

  app.use('/api/auth', authRoutes)
  app.use('/api/user', userRoutes)
  app.use('/api/aktie-transaktion', aktieTransaktionRoutes)
  app.use('/api/aktien', aktieRoutes)
  app.use('/api/dividenden', dividendenRoutes)
  app.use('/api/historisch', historischRoutes)
  app.use('/api/lists', listsRoutes)

  app.use(errorHandler)

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
  }

  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
  })
}
