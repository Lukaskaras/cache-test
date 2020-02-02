import { prop, getModelForClass } from '@typegoose/typegoose'

export default class Item {
  @prop({ unique: true })
  key: string

  @prop()
  value: string

  @prop()
  expiresAt: Date

  @prop()
  ttl: number
}

export const ItemModel = getModelForClass(Item)
