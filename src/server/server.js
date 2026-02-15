import { WebSocketServer } from 'ws';
import { CONTEXTS, WS_PORT, WS_URL, SOCKET_EVENTS } from '../contants.shared.js';
import { dispatch, switchContext } from './router/router.js';
import { PlayersService } from './service/players.service.js';

const { CONNECTION, MESSAGE, CLOSE, LISTENING } = SOCKET_EVENTS
const wss = new WebSocketServer({ port: WS_PORT });

wss.on(CONNECTION, (ws) => {
  const playerId = Math.random().toString(36).slice(2, 9)
  
  PlayersService.addPlayer(playerId, { ws, me: {} })

  switchContext(playerId, CONTEXTS.HOME)
  
  ws.on(MESSAGE, (data) => {
    console.log(MESSAGE, data.toString())
    const d = JSON.parse(data)

    dispatch({
      playerId, 
      type: d?.type, 
      payload: d?.payload
    })
  })

  ws.on(CLOSE, () => PlayersService.removePlayer(playerId));
})

wss.on(LISTENING, () => {
  console.log(`Server started at ${WS_URL}`)
})
