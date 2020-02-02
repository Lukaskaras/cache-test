import mongoose from 'mongoose'
import express from 'express'

const app = express()

const userName = process.env.MONGO_USERNAME
const password = process.env.MONGO_PASSWORD

const start = async () => {
  await mongoose.connect(`mongodb://${userName}:${password}@localhost:27017/`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'cache-db'
  })

  app.listen(6000, () => console.log('server running on 6000'))

}

start()
  .then(() => {
  console.log('server started')
})
  .catch((err) => {
    console.log('error starting server', err)
  })
