import axios from 'axios'
import * as assert from 'assert'
import config from 'config'
import { resetDatabase } from '../utils'
import { ItemModel } from '../../src/entities/Item'

const url = `http://localhost:${config.get('port')}`

describe('Integration tests', async () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  it('should store key', async () => {
    await axios.request({
      method: 'POST',
      url: `${url}/item`,
      data: {
        key: 'user',
        value: 'John',
        ttl: 900
      }
    })
    const allItems = await ItemModel.find({}).exec()
    assert.strictEqual(allItems.length, 1)
    assert.strictEqual(allItems[0].value, 'John')
  })
})
