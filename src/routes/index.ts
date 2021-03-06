import express from 'express'
import ItemController from '../controllers/ItemController'
const router = express.Router()

const itemController = new ItemController()

router.get('/item', itemController.getItem)
router.post('/item', itemController.postItem)
router.delete('/item', itemController.deleteItem)
router.get('/items', itemController.getAllItems)
router.delete('/items', itemController.deleteAllItems)

export default router
