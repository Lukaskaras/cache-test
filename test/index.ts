import { httpApp, startServer } from '../src'

before((done) => {
  console.log('starting')
  startServer
    .then(() => {
      done()
    })
})

after((done) => {
  httpApp.close(() => {
    done()
  })
})
