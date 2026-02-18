import { WebSocketServer } from 'ws';
import { WS_URL, SOCKET_EVENTS } from '../../shared/contants.shared.js';

const { CONNECTION, MESSAGE, CLOSE, LISTENING } = SOCKET_EVENTS

const sessions = new Map()

export const initWebSocketServer = (server, { onConnection, onMessage, onDisconnect }) => {
  if(!onConnection || !onMessage || !onDisconnect) throw new Error('onConnection and onMessage are required')
        
  const wss = new WebSocketServer({ server });

  wss.on(CONNECTION, (ws) => {

    const session = {
      id: Math.random().toString(36).slice(2, 9),
      ws,
      emit: (type, payload) =>  ws?.send?.(JSON.stringify({ type, payload })),
    }

    onConnection(session)

    sessions.set(session.id, session)

    ws.on(MESSAGE, (data) => {
      const d = JSON.parse(data)
      onMessage({ session, type: d?.type, payload: d?.payload })    
    })

    ws.on(CLOSE, () => onDisconnect(session));
  })

  wss.on(LISTENING, () => {
    console.log(`Server started at ${WS_URL}`)
  })
}