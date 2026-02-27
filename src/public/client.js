import { WebSocketRouter } from "/shared/client.shared.js"
import { WS_URL } from "/shared/contants.shared.js"

const connect = (url, handlers) => {
  const ws = new WebSocket(url)

  ws.onmessage = (data) => handlers.onmessage?.(JSON.parse(data?.data))
  ws.onclose = (args) => handlers.onclose?.(args)
  ws.onerror = (args) => handlers.onerror?.(args)

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

  const timeRemaining = ref('00:00')
  
  let client = null

  // timeoutDate is ISOString
  const timeoutDate = computed(() => state.value?.data?.game?.timeoutDate)

  setInterval(() => {
    if (!timeoutDate.value) return
    
    const diff = new Date(timeoutDate.value) - new Date()
    const totalSeconds = Math.max(0, Math.floor(diff / 1000))
    
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
    const s = (totalSeconds % 60).toString().padStart(2, '0')
    
    timeRemaining.value = `${m}:${s}`
  }, 200)
  
  const send = (action) => {
    client?.send?.(action?.type, action?.payload)
  }

  const close = () => {
    state.value.data = {}
    state.value.error = {}
    client?.close?.()
  }

  const search = () => {
    client = connect(WS_URL, 
      WebSocketRouter(
          (data) => {
            state.value.data = data
          },
          (error) => {
            state.value.error = error
          },
          () => {
            state.value.data = {}
            state.value.error = {}
          }
      )
  )
  }

  return { 
    state,
    send,
    timeRemaining,
    close,
    search
  }
}
}).mount('#app')
