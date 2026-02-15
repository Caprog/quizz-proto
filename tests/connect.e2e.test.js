import { test, describe } from 'node:test'
import { TestClient } from './shared/test.utils.js'

describe('connect', () => {
  let client

  test('should connect to the server', async () => {
    client = new TestClient()

    await client.connect()
      .evaluate({
        expression: (client) => client.isReady(), 
        message: 'Client is not ready'
      })
  })

  test('should close the connection', async () => {
    await client.close()
      .evaluate({
        expression: (client) => !client.isReady(), 
        message: 'Client is still ready'
      })
  })

})
