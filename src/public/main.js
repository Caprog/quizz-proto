import { connect } from "./client.js"
import { state } from "./src/store.js"
import { subscribe } from 'https://esm.sh/valtio'
import { WebSocketRouter } from "/shared/client.shared.js"
import { WS_URL } from "/shared/contants.shared.js"

const setup = () => {
    const ws = connect(WS_URL, 
      WebSocketRouter(
          (data) => {
            state.payload = data
          },
          (error) => {},
          () => {}
      )
    )

    let startCountDownTime = null
    let endCountDownTime = null
    let lastEndCountDownTime = null

    subscribe(state, () => {
        console.log(JSON.stringify(state.payload, null, 2))
        if(state.payload?.game?.phase === 'question') {
          const option = state
            .payload
            .game
            .data
            .options[Math.floor(Math.random() * state.payload.game.data.options.length)]
          ws.send('select', option.value)   
        }

        // dateToNextState is ISOString
        if(lastEndCountDownTime !== state.payload.game.dateToNextState) {
            lastEndCountDownTime = state.payload.game.dateToNextState
            startCountDownTime = Date.now()
            endCountDownTime = new Date(state.payload.game.dateToNextState).getTime()
        }
        document.getElementById('state').textContent = JSON.stringify(state.payload, null, 2)
    })

    // countdown bar start use countdown time to compute width calculate percentage of time remaining
    setInterval(() => {
      const percentage = ((endCountDownTime - Date.now()) / (endCountDownTime - startCountDownTime)) * 100
      document.getElementById('countdown_bar').style.width = `${percentage < 0 ? 0 : percentage}%`
    }, 100)

    return {
      
    }
}

window.api = setup()