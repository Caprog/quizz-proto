import { WebSocket } from 'ws';
import { SOCKET_EVENTS } from '../shared/contants.shared';

const { MESSAGE, CLOSE, ERROR } = SOCKET_EVENTS

export const connect = (url, { onMessage, onClose, onError }) => {
  const ws = new WebSocket(url)

  ws.on(MESSAGE, (data) => onMessage?.(JSON.parse(data)))
  ws.on(CLOSE, (args) => onClose?.(args))
  ws.on(ERROR, (args) => onError?.(args))
  
  const send = (type, payload) => {
    if (isReady()) {
      // console.log('send', type, payload)
      ws.send(JSON.stringify({ type, payload }))
    }
  }

  const isReady = () => ws.readyState === WebSocket.OPEN

  const close = () => ws.close()

  return {
    send,
    isReady,
    close
  }
}



