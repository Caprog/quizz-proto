import { WebSocketServer } from 'ws';
import { WS_URL, SOCKET_EVENTS } from '../../shared/contants.shared.js';

const { CONNECTION, MESSAGE, CLOSE, LISTENING } = SOCKET_EVENTS

const sessions = new Map()

export const initWebSocketServer = (server, { onConnection, onMessage, onDisconnect }) => {
  if(!onConnection || !onMessage || !onDisconnect) throw new Error('onConnection and onMessage are required')
        
  const wss = new WebSocketServer({ server });

  wss.on(CONNECTION, (ws) => {

    const emit = ({ id, type, payload }) =>  {
        console.log('emit', type, payload)

        if(id) {
          const session = sessions.get(id)
          session?.emit?.({ type, payload })
          return
        }

        ws?.send?.(JSON.stringify({ type, payload }))
    }

    const session = {
      id: Math.random().toString(36).slice(2, 9),
      isBot: ws.protocol === 'bot-protocol',
      emit,
      close: () => ws.close()
    }

    onConnection(session)

    sessions.set(session.id, session)

    ws.on(MESSAGE, (data) => {
      const { type, payload } = JSON.parse(data) ?? {}
      onMessage(session, { type, payload })
    })

    ws.on(CLOSE, () => {
      sessions.delete(session.id)
      onDisconnect(session)
    });
  })

  wss.on(LISTENING, () => {
    console.log(`Server started at ${WS_URL}`)
  })
}