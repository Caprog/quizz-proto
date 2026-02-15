import { WebSocketRouter } from "/shared/client.shared.js"
import { WS_URL } from "/shared/contants.shared.js"

export const connect = (url, onMessage) => {
  const ws = new WebSocket(url)

  ws.onmessage = (data) => onMessage?.(JSON.parse(data?.data))

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
        (data) => {
          document.getElementById('app').innerHTML = JSON.stringify(data, null, 2)
        },
        (error) => {
          document.getElementById('app').innerHTML = JSON.stringify(error, null, 2)
        }
    ).onmessage
)
