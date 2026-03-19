import { WebSocketServer } from 'ws'
import { WS_URL, SOCKET_EVENTS } from '../../shared/contants.shared.js'
import { Trivia } from './trivia.js'

const { CONNECTION, MESSAGE, CLOSE, LISTENING } = SOCKET_EVENTS
const sessions = new Map()

const emit = ({ id, type, payload }) =>  {
    if(!id) return
    sessions.get(id)?.emit?.({ type, payload })
}

const game = new Trivia({ questionsCount: 10 }, { emit })

export const initWebSocketServer = (server) => {
  
  const wss = new WebSocketServer({ server })
  wss.on(CONNECTION, (ws) => {
    const session = {
      id: Math.random().toString(36).slice(2, 9),
      emit: ({ type, payload }) => ws.send(JSON.stringify({ type, payload })),
      close: () => ws.close()
    }

    sessions.set(session.id, session)

    game.join(session.id)

    ws.on(MESSAGE, (data) => {
      const { type, payload } = JSON.parse(data) ?? {}
      game.handle(session.id, { type, payload })
    })

    ws.on(CLOSE, () => {
      sessions.delete(session.id)
      game.leave(session.id)
    })
  })

  wss.on(LISTENING, () => {
    console.log(`Server started at ${WS_URL}`)
  })
}
