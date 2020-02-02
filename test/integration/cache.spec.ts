import * as assert from 'assert'
import { ItemModel } from '../../src/entities/Item'
import { getAllKeys, postKey, resetDatabase } from '../utils'

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
})

