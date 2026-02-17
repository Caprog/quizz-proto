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

const { createApp, ref, computed } = Vue

createApp({
  setup() {
  const state = ref(
    {
      data: {},
      error: {}
    }
  )
  
  const client = connect(WS_URL, 
      WebSocketRouter(
          (data) => {
            state.value.data = data
          },
          (error) => {
            state.value.error = error
          }
      ).onmessage
  )

  const isContext = (context) => state.value?.data?.context === context

  const actions = computed(() => state.value?.data?.me?.actions ?? {})

  const send = (action) => {
   client.send(action?.type, action?.payload)
  }

  return { state, isContext, actions, send }
}
}).mount('#app')
