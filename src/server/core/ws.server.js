import { WebSocketServer } from 'ws';
import { WS_URL, SOCKET_EVENTS } from '../../shared/contants.shared.js';
import { RouterFactory } from './router.js';

const { CONNECTION, MESSAGE, CLOSE, LISTENING } = SOCKET_EVENTS

const sessions = new Map()

export const initWebSocketServer = (server, routes) => {
  if(!routes) throw new Error('Routes are required')
        
  const wss = new WebSocketServer({ server });

  wss.on(CONNECTION, (ws) => {

    const session = {
      id: Math.random().toString(36).slice(2, 9),
      ws,
      emit: (type, payload) => emit(session, { type, payload }),
    }

    const router = RouterFactory(routes, session)

    sessions.set(session.id, session)

    ws.on(MESSAGE, (data) => {
      const d = JSON.parse(data)
      router.handle(d?.type, d?.payload)    
    })

    ws.on(CLOSE, () => router.disconnect());
  })

  wss.on(LISTENING, () => {
    console.log(`Server started at ${WS_URL}`)
  })
}

export const emit = (session, data) => {
  console.log('emit', data)
  session?.ws?.send?.(JSON.stringify(data))
}