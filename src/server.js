import { WebSocketServer } from 'ws';
import { WS_PORT, WS_URL } from './contants.shared.js';

const wss = new WebSocketServer({ port: WS_PORT });
const state = new Map();

const handlers = {

};

wss.on('connection', (ws) => {
  const id = Math.random().toString(36).slice(2, 9)
  
  state.set(id, {});
  
  ws.on('message', (data) => {
    const d = JSON.parse(data)
    console.log(d)
    // state.set(id, { type, payload })
  })

  ws.on('close', () => state.delete(id));
})

wss.on('listening', () => {
  console.log(`Server started at ${WS_URL}`)
})