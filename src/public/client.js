import { UILayer } from "./src/ui.entity.js"
import { World } from "./src/world.entity.js"
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

const setup = () => {

  const world = new World()
  
  let activeConnection = null

  const startMatch = () => {
    uiLayer.hideMainMenu()
    uiLayer.showMessage('RECHERCHE DE JOUEURS...')

    activeConnection = connect(WS_URL, 
      WebSocketRouter(
          (data) => {
            world.handle(data)
            uiLayer.handle(data)
          },
          (error) => {
            uiLayer.handleError(error)
          },
          () => {
            world.reset()
            uiLayer.reset()
          }
      )
    )

    uiLayer.send = activeConnection.send
  }

  const uiLayer = new UILayer({
    onStart: startMatch
  })

  uiLayer.onRestart = () => {
    activeConnection?.close()
    world.reset()
    uiLayer.reset()
    uiLayer.hideMainMenu()
    startMatch()
  }
  // request animation frame for draw
  const update = () => {
    world.draw()
    uiLayer.draw()
    requestAnimationFrame(update)
  }
  
  update()
}

setup()

// const { createApp, ref, computed } = Vue

// createApp({
//   setup() {
//   const state = ref(
//     {
//       ui: {
//         showJson: false
//       },
//       data: {},
//       error: {}
//     }
//   )

//   const timeRemaining = ref('00:00')
  
//   let client = null

//   // timeoutDate is ISOString
//   const timeoutDate = computed(() => state.value?.data?.game?.timeoutDate)

//   setInterval(() => {
//     if (!timeoutDate.value) return
    
//     const diff = new Date(timeoutDate.value) - new Date()
//     const totalSeconds = Math.max(0, Math.floor(diff / 1000))
    
//     const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
//     const s = (totalSeconds % 60).toString().padStart(2, '0')
    
//     timeRemaining.value = `${m}:${s}`
//   }, 200)
  
//   const send = (action) => {
//     client?.send?.(action?.type, action?.payload)
//   }

//   const close = () => {
//     state.value.data = {}
//     state.value.error = {}
//     client?.close?.()
//   }

//   const search = () => {
//     client = connect(WS_URL, 
//         WebSocketRouter(
//             (data) => {
//               state.value.data = data
//             },
//             (error) => {
//               state.value.error = error
//             },
//             () => {
//               state.value.data = {}
//               state.value.error = {}
//             }
//         )
//     )
//   }

//   // when press space, show data modal
//   window.addEventListener('keydown', (e) => {
//     if (e.code === 'Space') {
//       state.value.ui.showJson = !state.value.ui.showJson
//     }
//   })

//   return { 
//     state,
//     send,
//     timeRemaining,
//     close,
//     search
//   }
// }
// }).mount('#app')
