import express from 'express'
import { deleteAllItems, deleteItem, getAllItems, getItem, postItem } from '../controllers/ItemController'
const router = express.Router()

router.get('/test', async (req, res) => {
  console.log('called test')
  res.sendStatus(200)
})

router.get('/item', getItem)
router.post('/item', postItem)
router.delete('/item', deleteItem)
router.get('/items', getAllItems)
router.delete('/items', deleteAllItems)

export default router
