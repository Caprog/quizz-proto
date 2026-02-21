import { WebSocket } from 'ws';

export const connect = (url, onMessage) => {
  const ws = new WebSocket(url)

  ws.on('message', (data) => onMessage?.(JSON.parse(data)))

  const send = (type, payload) => {
    if (isReady()) {
      console.log('send', type, payload)
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



