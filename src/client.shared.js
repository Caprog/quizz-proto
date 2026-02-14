import { WS_URL } from './contants.shared.js';

export const connect = (url, onSync) => {
  const ws = new WebSocket(url)

  ws.on('message', (data) => {
    const { t, p } = JSON.parse(data)
    if (t === 's') onSync(p)
  })

  const send = (type, payload) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, payload }))
    }
  }

  return { ws, send }
}

const { send } = connect(WS_URL, (state) => {
  console.clear()
  console.log('Current Game State:', state)
})