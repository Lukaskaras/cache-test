import express from 'express'
import { postItem } from '../controllers/ItemController'
const router = express.Router()

router.get('/test', async (req, res) => {
  console.log('called test')
  res.sendStatus(200)
})

router.post('/item', postItem)

export default router
