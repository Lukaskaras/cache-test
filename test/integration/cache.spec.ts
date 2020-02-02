import * as assert from 'assert'
import { ItemModel } from '../../src/entities/Item'
import { deleteKey, getAllKeys, getKey, postKey, resetDatabase } from '../utils'

describe('Integration tests', async () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  describe('POST /item', async () => {
    it('should store key', async () => {
      await postKey('User', 'John')
      const allItems = await ItemModel.find({}).exec()
      assert.strictEqual(allItems.length, 1)
      assert.strictEqual(allItems[0].value, 'John')
    })

    it('should update key if it already exists', async () => {
      await postKey('User', 'John')
      const allItems = await ItemModel.find({}).exec()
      assert.strictEqual(allItems.length, 1)
      assert.strictEqual(allItems[0].value, 'John')

      await postKey('User', 'Manuel')
      const allItemsAfter = await ItemModel.find({}).exec()
      assert.strictEqual(allItemsAfter.length, 1)
      assert.strictEqual(allItemsAfter[0].value, 'Manuel')
    })
  })

  describe('GET /items', async () => {
    it('should return all items', async () => {
      await Promise.all([
        postKey('User', 'John'),
        postKey('Key', 'Value')
      ])
      const allKeys = await getAllKeys()
      assert.strictEqual(allKeys.length, 2)
      assert.ok([ 'User', 'Key' ].includes(allKeys[0].key))
      assert.ok([ 'User', 'Key' ].includes(allKeys[1].key))
    })
  })

  describe('GET /item', async () => {
    it('should return item when exists', async () => {
      await postKey('User', 'John')
      const result = await getKey('User')
      assert.strictEqual(result.value, 'John')
    })

    it('should return random string (and save it) if key does not exist', async () => {
      const result = await getKey('User')
      assert.strictEqual(result.value.length, 12)

      const allItems = await ItemModel.find({}).exec()
      assert.strictEqual(allItems.length, 1)
      assert.strictEqual(allItems[0].key, 'User')
      assert.strictEqual(allItems[0].value.length, 12)
    })
  })

  describe('DELETE /item', async () => {
    it('should delete item', async () => {
      await postKey('User', 'John')
      await postKey('Key', 'Value')
      await deleteKey('User')

      const allItems = await ItemModel.find({}).exec()
      assert.strictEqual(allItems.length, 1)
      assert.strictEqual(allItems[0].key, 'Key')
    })
  })
})

