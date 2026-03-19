import { WS_URL } from "../shared/contants.shared.js"
import { state } from "./src/store.js"
import { subscribe } from 'https://esm.sh/valtio'
import { Player } from "./src/player.entity.js"
import { Countdown } from "./src/countdown.entity.js"
import { PHASES } from "../shared/trivia.types.js"

const messageEl = document.getElementById('message')
const scoreEl = document.getElementById('score')
const spawnEl = document.getElementById('spawn')
const PLAYER_WIDTH = 4.13
const countdown = new Countdown()
const stairs = Array.from(document.querySelectorAll('.stair')).reverse()
let you = null

const others = []

export const connect = (url, handlers) => {
  const ws = new WebSocket(url)

  ws.onopen = (args) => handlers.onopen?.(args)
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

  subscribe(state, () => {
    console.log(JSON.stringify(state.payload, null, 2))
  })
  
  const start = () => {
    const ws = connect(WS_URL, 
      {
        onopen: () => {

          if(!you) {
            
            you = new Player({ 
              name: '',
              y: -1,
              width: PLAYER_WIDTH,
              stairs
            })

            spawnEl.appendChild(you.el)
          }

          messageEl.textContent = 'CONNECTED TO THE RETURN TO THE SOURCE'
        },
        onmessage: (data) => {
          state.payload = data?.payload
          messageEl.textContent = state.payload?.game?.phase
          
          you.handle(data?.payload)

          scoreEl.textContent = `Score: ${state.payload?.me?.score}`

          if(state.payload?.game?.phase === PHASES.QUESTION) {
            const options = state.payload?.game?.data?.options || []
            const option = options[Math.floor(Math.random() * options.length)]
            if(option) ws.send('select', option.value)   
          }
        },
        onclose: () => setTimeout(start, 5000),
        onerror: (error) => console.error(error)
      }
    )
  }


  // request animation frame for draw
  const update = () => {
    others?.forEach(other => other?.draw())
    you?.draw()
    countdown.update()
    requestAnimationFrame(update)
  }
  
  update()

  start()
}

setup()