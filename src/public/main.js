import { connect } from "./client.js"
import { state } from "./src/store.js"
import { subscribe } from 'https://esm.sh/valtio'
import { WebSocketRouter } from "/shared/client.shared.js"
import { WS_URL } from "/shared/contants.shared.js"

const setup = () => {
    
    subscribe(state, () => {
        console.log(JSON.stringify(state.payload, null, 2))
        document.getElementById('state').textContent = JSON.stringify(state.payload, null, 2)
    })

    const ws = connect(WS_URL, 
      WebSocketRouter(
          (data) => {
            state.payload = data
          },
          (error) => {},
          () => {}
      )
    )

    return {
      
    }
}

window.api = setup()