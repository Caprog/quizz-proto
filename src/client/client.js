import { WebSocket } from 'ws';

export const connect = (url, onSync) => {
  const ws = new WebSocket(url)

  ws.on('message', (data) => {
    const { type, payload } = JSON.parse(data)
    type === 'sync' && onSync(payload)
  })

  const send = (type, payload) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, payload }))
    }
  }

  return { ws, send }
}
