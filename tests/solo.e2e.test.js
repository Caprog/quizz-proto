import { test, describe, after } from 'node:test'
import { TestClient } from './shared/test.utils.js'
import { HOME_TESTS } from './home.e2e.test.js'

export const SOLO_TESTS = {
    shouldBeHome: {
        expression: (client) => client.state?.context === 'home', 
        message: 'Context should be home'
    },
    shouldBeGame: {
        expression: (client) => client.state?.context === 'game', 
        message: 'Context should be game'
    },
    shouldHaveLeaveAction: {
        expression: (client) => client.state?.me?.actions?.leave, 
        message: 'Me should have action leave'
    }
}

describe('solo', () => {
  const client = new TestClient()
  after(() => client?.close?.())

  test('should start solo game', async (t) => {
    client.connect()
    await client.evaluate(SOLO_TESTS.shouldBeHome)
    
    client.sendAction('solo')
    await client.evaluate(SOLO_TESTS.shouldBeGame)
  })

  test('should be leave game and return to the home', async (t) => {
    await client.evaluate(SOLO_TESTS.shouldHaveLeaveAction)
    client.sendAction('leave')
    await client.evaluate(HOME_TESTS.shouldBeHome)
  })

  test('all home test should be pass', async (t) => {
      await client.executeAll(Object.values(HOME_TESTS))
  })
})
