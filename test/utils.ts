import axios from 'axios'
import config from 'config'
import Item, { ItemModel } from '../src/entities/Item'

export const url = `http://localhost:${config.get('port')}`

export const resetDatabase = async () => {
  await ItemModel.deleteMany({})
}

export const postKey = async (key: string, value: string, ttl: number = 900) => {
  await axios.request({
    method: 'POST',
    url: `${url}/item`,
    data: {
      key,
      value,
      ttl
    }
  })
}

export const getAllKeys = async (): Promise<Item[]> => {
  const result = await axios.get(`${url}/items`)
  return result.data
}
