import { Request, Response } from 'express'
import { ItemModel } from '../entities/Item'

export const postItem = async (req: Request, res: Response) => {
  const { key, value, ttl } = req.body

  await ItemModel.create({
    key,
    value,
    ttl,
    expiresAt: new Date()
  })

  res.sendStatus(200)
}
