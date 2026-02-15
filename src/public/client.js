import { WebSocketRouter } from "/shared/client.shared.js"
import { WS_URL } from "/shared/contants.shared.js"

export const connect = (url, onMessage) => {
  const ws = new WebSocket(url)

  ws.onmessage = (data) => onMessage?.(JSON.parse(data))

  const send = (type, payload) => {
    if (isReady()) ws.send(JSON.stringify({ type, payload }))
  }

  const isReady = () => ws.readyState === WebSocket.OPEN

  const close = () => ws.close()

  return {
    isReady,
    send,
    close
  }
}

connect(WS_URL, 
    WebSocketRouter(
        (data) => console.log(data),
        (error) => console.log(error)
    ).onmessage
)
