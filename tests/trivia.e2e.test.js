import { test, describe, after, before } from 'node:test'
import { sleep, TestClient } from './shared/test.utils.js'

export const TRIVIA_TESTS = {
    shouldBeLobby: {
        expression: (client) => client.state?.game?.phase === 'lobby', 
        message: 'Context should be lobby'
    },
    shouldBeGame: {
        setup: async (client) => await sleep(2000),
        expression: (client) => client.state?.game?.phase === 'question', 
        message: 'Context should be game'
    },
    shouldHaveLeaveAction: {
        expression: (client) => client.state?.me?.actions?.leave, 
        message: 'Me should have action leave'
    },
}

describe('trivia', () => {
  const client = new TestClient()
  
  before(() => client.connect())
  
  after(() => client?.close?.())

  test('should start trivia game', async (t) => {
    await client.evaluate(TRIVIA_TESTS.shouldBeLobby)
    await client.execute(TRIVIA_TESTS.shouldBeGame)
  })

  test('should have leave action', async (t) => {
    // await client.evaluate(TRIVIA_TESTS.shouldHaveLeaveAction)
  })
})
