import { test, describe, after, afterEach } from 'node:test'
import { TestClient } from './shared/test.utils.js'
import { SOLO_TESTS } from './solo.e2e.test.js'
import { GAME_QUESTION_SCHEMA } from './schema/game.question.schema.js'

describe('solo.game.loop', () => {
  const client = new TestClient()
  let data = null
  after(() => client?.close?.())
  
  test('should have game phase question', async (t) => {
    client.connect()
    await client.evaluate(SOLO_TESTS.shouldBeHome)
    client.sendAction('solo')

    await client.evaluate({
      expression: (client) => client.state?.game?.phase === 'question', 
      message: 'Context should be game.phase = question'
    })

    data = client.state?.game?.data
  })

  test('game should have a valid data schema for the question', async (t) => {
    await client.evaluate({
      expression: (client) => GAME_QUESTION_SCHEMA.parse(client.state?.game?.data), 
      message: 'Game data should be a valid question schema'
    })
  })


  test('me should have actions select and confirm', async (t) => {
    await client.evaluate({
      expression: (client) => 
        client.state?.me?.actions?.select && 
        client.state?.me?.actions?.confirm, 
      message: 'Me should have actions select and confirm'
    })
  })

  test('should select an option', { skip: true }, async (t) => {
    const options = client.state?.game?.data?.options
    client.sendAction('select', options?.[0]?.value)
    
    await client.evaluate({
      expression: (client) => client.state?.me?.selection?.[0] === options?.[0]?.value, 
      message: 'Me selection should be the first option'
    })
  })

  test('should select random option', { skip: true }, async (t) => {
    const options = client.state?.game?.data?.options
    const value = options?.[Math.floor(Math.random() * options?.length)]?.value
    client.sendAction('select', value)
    
    await client.evaluate({
      expression: (client) => client.state?.me?.selection?.[0] === value, 
      message: 'Me selection should be a random option'
    })
  })

  test('should game data will have the same data', async (t) => {
    await client.evaluate({
      expression: (client) => JSON.stringify(client.state?.game?.data) === JSON.stringify(data), 
      message: 'Game data should be the same'
    })
  })

  test('should confirm option', { skip: true }, async (t) => {
    client.sendAction('confirm')
    
    await client.evaluate({
      expression: (client) => client.state?.game?.phase === 'feedback', 
      message: 'Context should be game.phase = feedback'
    })

    // only leave game action should be available
    await client.evaluate({
      expression: (client) => 
        Object.keys(client.state?.me?.actions).length === 1 && 
        client.state?.me?.actions?.leave, 
      message: 'Me actions should be undefined'
    })
  })

})
