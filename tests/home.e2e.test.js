import { test, describe, after } from 'node:test'
import { TestClient } from './shared/test.utils.js'
import { ACTIONS_SCHEMA } from './schema/action.schema.js'
import { CONTEXT_SCHEMA } from './schema/context.schema.js'

const shouldBeValidAction = (client, actionName) => ACTIONS_SCHEMA.parse(client.state?.me?.actions?.[actionName])

export const HOME_TESTS = {
  shouldBeHome: {
      expression: (client) => client.state?.context === 'home', 
      message: 'Context should be home'
    },
  shouldBeValid: {
      expression: (client) => CONTEXT_SCHEMA.parse(client.state?.context), 
      message: 'Context should be valid'
    },
  shouldHaveActions: {
      expression: (client) => client.state?.me?.actions?.solo && client.state?.me?.actions?.join && client.state?.me?.actions?.create, 
      message: 'Me should have actions solo, join and create'
    },
  shouldBeValidSoloAction: {
      expression: (client) => shouldBeValidAction(client, 'solo'), 
      message: 'Action solo should be a valid action'
    },
  shouldBeValidJoinAction: {
      expression: (client) => shouldBeValidAction(client, 'join'), 
      message: 'Action join should be a valid action'
    },
  shouldBeValidCreateAction: {
      expression: (client) => shouldBeValidAction(client, 'create'), 
      message: 'Action create should be a valid action'
    },
  shouldBlockUnknownAction: {
    setup: (client) => client.send('unknown', {}),
    expression: (client) => 
      client.error?.type === 'ACTION_NOT_ALLOWED'
      && client.error?.action === 'unknown'
      && client.error?.allowedActions?.length === 1
      && client.error?.allowedActions?.includes('solo'), 
    message: 'Action unknown should be blocked'
  },
}

describe('home', () => {
  const client = new TestClient()

  after(() => client?.close?.())

  test('context should be home', async (t) => {
    client.connect()
    await client.evaluate(HOME_TESTS.shouldBeHome)
  })

  test('context should be valid', async (t) => {
    await client.evaluate(HOME_TESTS.shouldBeValid)
  })

  test('me should have actions solo, join, create', async (t) => {
    await client.evaluate(HOME_TESTS.shouldHaveActions)
  })

  test('action solo should be a valid action', async (t) => {
    await client.evaluate(HOME_TESTS.shouldBeValidSoloAction)
  })

  test('action join should be a valid action', async (t) => {
    await client.evaluate(HOME_TESTS.shouldBeValidJoinAction)
  })

  test('action create should be a valid action', async (t) => {
    await client.evaluate(HOME_TESTS.shouldBeValidCreateAction)
  })

  test('action unknown should be blocked', async (t) => {
    await client.execute(HOME_TESTS.shouldBlockUnknownAction)
  })
})
