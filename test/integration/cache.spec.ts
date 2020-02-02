import * as assert from 'assert'
import { ItemModel } from '../../src/entities/Item'
import { createExpiredItem, deleteAll, deleteKey, getAllKeys, getKey, postKey, resetDatabase } from '../utils'

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

    it('should update key if it already exists', async () => {
      await postKey('User', 'John')
      await postKey('test-key1', 'test-value1')
      await postKey('test-key2', 'test-value2')

      const allItems = await ItemModel.find({}).exec()
      assert.strictEqual(allItems.length, 2)
      assert.ok([ 'test-key1', 'test-key2' ].includes(allItems[0].key))
      assert.ok([ 'test-key1', 'test-key2' ].includes(allItems[1].key))
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

    it('should return all items except expired', async () => {
      await Promise.all([
        postKey('User', 'John'),
        createExpiredItem('Key', 'Value')
      ])

      const allItems = await ItemModel.find({}).exec()
      assert.strictEqual(allItems.length, 2)

      const allItemsWithoutExpired = await getAllKeys()
      assert.strictEqual(allItemsWithoutExpired.length, 1)
      assert.strictEqual(allItemsWithoutExpired[0].value, 'John')
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

    it('should return random string (and save it) if expired', async () => {
      await createExpiredItem('User', 'John')

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

  describe('DELETE /items', async () => {
    it('should delete all items', async () => {
      await postKey('User', 'John')
      await postKey('Key', 'Value')
      await deleteAll()

      const allItems = await ItemModel.find({}).exec()
      assert.strictEqual(allItems.length, 0)
    })
  })
})

