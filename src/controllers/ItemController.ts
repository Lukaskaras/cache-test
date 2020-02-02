import { Request, Response } from 'express'
import config from 'config'
import moment from 'moment'
import Item, { ItemModel } from '../entities/Item'
import mongoErrorCodes from '../mongoErrorCodes'
import { generateRandomString } from '../utils'

const defaultTtl = config.get('defaultTtl')
const maxItems = config.get('maxItems')

export const postItem = async (req: Request, res: Response) => {
  const { key, value, ttl } = req.body

  const itemTtl = ttl || defaultTtl
  const expiresAt = moment().add(itemTtl, 'seconds').toDate()
  await createItem(key, value, expiresAt)

  res.sendStatus(200)
}

export const getAllItems = async (req: Request, res: Response): Promise<void> => {
  const items = await ItemModel.find({ expiresAt: { $gte: new Date() }}).exec()
  res.send(items)
}

export const getItem = async (req: Request, res: Response): Promise<void> => {
  const { key } = req.query
  const item = await ItemModel.findOne({ key }).exec()

  const now = new Date()
  const expiresAt = moment().add(defaultTtl, 'seconds').toDate()
  const randomString = generateRandomString()

  let updatedItem: Item
  if (!item) {
    await createItem(key, randomString, expiresAt)
    updatedItem = {
      key,
      value: randomString,
      expiresAt
    }
  }

  if (item) {
    if (new Date(item.expiresAt).getTime() < now.getTime()) {
      console.log('item is expired')
      updatedItem = {
        key,
        value: randomString,
        expiresAt
      }
      res.send(updatedItem)
      await ItemModel.updateOne({ key }, updatedItem)
    } else {
      console.log('Cache hit')
      updatedItem = {
        key,
        value: item.value,
        expiresAt
      }
      await ItemModel.updateOne({ key }, updatedItem)
    }
  }

  res.send(updatedItem)
}

export const deleteItem = async (req: Request, res: Response) => {
  const { key } = req.query

  const result = await ItemModel.deleteOne({ key }).exec()

  if (!result.deletedCount) {
    res.sendStatus(404)
    return
  }

  res.sendStatus(200)
}

export const deleteAllItems = async (req: Request, res: Response) => {
  await ItemModel.deleteMany({}).exec()
  res.sendStatus(200)
}

const createItem = async (key: string, value: string, expiresAt: Date): Promise<void> => {
  const allItems = await ItemModel.find({}).sort({ expiresAt: 'asc' }).exec()

  // when limit is reached, item with oldest expiration is updated
  if (allItems.length === maxItems) {
    await ItemModel.updateOne({ _id: allItems[0]._id }, {
      key,
      value,
      expiresAt
    })
    return
  }

  try {
    await ItemModel.create({
      key,
      value,
      expiresAt
    })
  } catch (err) {
    if (err.code === mongoErrorCodes.duplicateKey) {
      console.log('item already exists, going to update')
      await ItemModel.updateOne({ key }, {
        value,
        expiresAt
      })
    }
  }
}
