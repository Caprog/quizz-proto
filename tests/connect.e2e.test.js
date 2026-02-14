import { test, describe } from 'node:test'
import { TestClient } from './test.utils.js'

describe('connect', () => {
  let client

  test('should connect to the server', async () => {
    client = new TestClient()

    await client.connect()
      .evaluate((client) => client.isReady(), 'Client is not ready')
  })

  test('should close the connection', async () => {
    await client.close()
      .evaluate((client) => !client.isReady(), 'Client is still ready')
  })

})
