import { Request, Response } from 'express'
import { ItemModel } from '../entities/Item'
import mongoErrorCodes from '../mongoErrorCodes'

export const postItem = async (req: Request, res: Response) => {
  const { key, value, ttl } = req.body

  try {
    await ItemModel.create({
      key,
      value,
      ttl,
      expiresAt: new Date()
    })
  } catch (err) {
    if (err.code === mongoErrorCodes.duplicateKey) {
      console.log('item already exists, going to update')
      await ItemModel.update({ key }, {
        value,
        ttl,
        expiresAt: new Date()
      })
    }
  }

  res.sendStatus(200)
}

export const getAllItems = async (req: Request, res: Response): Promise<void> => {
  const items = await ItemModel.find({}).exec()
  res.send(items)
}
