import { ItemModel } from '../src/entities/Item'

export const resetDatabase = async () => {
  await ItemModel.deleteMany({})
}
