import { WebSocketServer } from 'ws';
import { CONTEXTS, WS_PORT, WS_URL } from './contants.shared.js';
import { broadcast, dispatch, enter } from './router.js';
import { PlayersService } from './service/players.service.js';

const wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', (ws) => {
  const playerId = Math.random().toString(36).slice(2, 9)
  
  PlayersService.addPlayer(playerId, { ws, me: {} })

  broadcast(enter(playerId, CONTEXTS.HOME))
  
  ws.on('message', (data) => {
    console.log('message', data.toString())
    const d = JSON.parse(data)

    dispatch({
      playerId, 
      type: d?.type, 
      payload: d?.payload
    })
  })

  ws.on('close', () => PlayersService.removePlayer(playerId));
})

wss.on('listening', () => {
  console.log(`Server started at ${WS_URL}`)
})
