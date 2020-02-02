import { Request, Response } from 'express'
import generate from 'nanoid/generate'
import config from 'config'
import moment from 'moment'
import Item, { ItemModel } from '../entities/Item'
import mongoErrorCodes from '../mongoErrorCodes'

const defaultTtl = config.get('defaultTtl')

export const postItem = async (req: Request, res: Response) => {
  const { key, value, ttl } = req.body

  const itemTtl = ttl || defaultTtl
  try {
    await ItemModel.create({
      key,
      value,
      expiresAt: moment().add(itemTtl, 'seconds').toDate()
    })
  } catch (err) {
    if (err.code === mongoErrorCodes.duplicateKey) {
      console.log('item already exists, going to update')
      await ItemModel.update({ key }, {
        value,
        expiresAt: moment().add(itemTtl, 'seconds').toDate()
      })
    }
  }

  res.sendStatus(200)
}

export const getAllItems = async (req: Request, res: Response): Promise<void> => {
  const items = await ItemModel.find({}).exec()
  res.send(items)
}

export const getItem = async (req: Request, res: Response): Promise<void> => {
  const { key } = req.query
  const item = await ItemModel.findOne({ key }).exec()

  if (item) {
    console.log('Cache hit')
    res.send(item)
    return
  }

  console.log('Cache miss')
  const randomString = generate('1234567890abcdefghijklmnopqrstuvwxyz', 12)
  const newItem: Item = {
    key,
    value: randomString,
    expiresAt: moment().add(defaultTtl, 'seconds').toDate()
  }
  res.send(newItem)

  await ItemModel.create(newItem)
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
