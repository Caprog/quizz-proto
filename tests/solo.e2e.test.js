import { test, describe, after, before } from 'node:test'
import { TestClient } from './shared/test.utils.js'
import { HOME_TESTS } from './home.e2e.test.js'

export const SOLO_TESTS = {
    shouldBeHome: {
        expression: (client) => client.state?.context === 'home', 
        message: 'Context should be home'
    },
    shouldBeGame: {
        setup: (client) => client.sendAction('solo'),
        expression: (client) => client.state?.context === 'game', 
        message: 'Context should be game'
    },
    shouldHaveLeaveAction: {
        expression: (client) => client.state?.me?.actions?.leave, 
        message: 'Me should have action leave'
    },
    gotoHomeAndShouldBeHome: {
        setup: (client) => client.sendAction('leave'),
        expression: (client) => client.state?.context === 'home', 
        message: 'Context should be home'
    }
}

describe('solo', () => {
  const client = new TestClient()
  
  before(() => client.connect())
  
  after(() => client?.close?.())

  test('should start solo game', async (t) => {
    await client.evaluate(SOLO_TESTS.shouldBeHome)
    await client.execute(SOLO_TESTS.shouldBeGame)
  })

  test('should be leave game and return to the home', async (t) => {
    await client.evaluate(SOLO_TESTS.shouldHaveLeaveAction)
    await client.execute(SOLO_TESTS.gotoHomeAndShouldBeHome)
  })

  test('all home test should be pass', async (t) => {
      await client.executeAll(Object.values(HOME_TESTS))
  })
})
