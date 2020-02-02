import express from 'express'
import { getAllItems, postItem } from '../controllers/ItemController'
const router = express.Router()

router.get('/test', async (req, res) => {
  console.log('called test')
  res.sendStatus(200)
})

router.post('/item', postItem)
router.get('/items', getAllItems)

export default router
