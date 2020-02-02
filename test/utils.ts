import axios from 'axios'
import config from 'config'
import moment from 'moment'
import Item, { ItemModel } from '../src/entities/Item'

export const url = `http://localhost:${config.get('port')}`

export const resetDatabase = async () => {
  await ItemModel.deleteMany({})
}

export const postKey = async (key: string, value: string, ttl: number = 900) => {
  return axios.request({
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

export const getKey = async (key: string): Promise<Item> => {
  const result = await axios.request({
    method: 'GET',
    url: `${url}/item`,
    params: {
      key
    }
  })
  return result.data
}

export const deleteKey = async (key: string): Promise<void> => {
  await axios.request({
    method: 'DELETE',
    url: `${url}/item`,
    params: {
      key
    }
  })
}

export const deleteAll = async (): Promise<void> => {
  await axios.delete(`${url}/items`)
}

export const createExpiredItem = async (key: string, value: string): Promise<void> => {
  await ItemModel.create({
    key,
    value,
    expiresAt: moment().subtract(5, 'seconds').toDate()
  })
}
