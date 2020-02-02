import mongoose from 'mongoose'
import express from 'express'
import bodyParser from 'body-parser'
import config from 'config'
import routes from './routes/index'

const app = express()

const userName = process.env.MONGO_USERNAME
const password = process.env.MONGO_PASSWORD

let httpApp
const start = async () => {
  let connection
  if (userName && password) {
    connection = `${userName}:${password}@`
  } else {
    console.warn('connecting to mongo without auth')
    connection = ''
  }

  await mongoose.connect(`mongodb://${connection}localhost:27017/`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    dbName: config.get('mongo.dbName')
  })

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  app.use((req, res, next) => {
    console.log('calling ' + req.method + ' for ' + req.path + ' -> ' + JSON.stringify(req.query) + ' -> ' + JSON.stringify(req.body))
    next()
  })

  app.use('/', routes)

  const port = config.get('port')
  return new Promise(resolve => {
    httpApp = app.listen(port, () => {
      console.log(`server running on ${port}`)
      resolve()
    })
  })
}

const startServer = start()
startServer
  .then(() => {
  console.log('server started')
})
  .catch((err) => {
    console.log('error starting server', err)
  })

export {
  app,
  startServer,
  httpApp
}
