import { WebSocketServer } from 'ws';
import { WS_URL, SOCKET_EVENTS } from '../../shared/contants.shared.js';
import { StateMachine } from './state.machine.js';
import { runGuards } from './guard.utils.js';

const { CONNECTION, MESSAGE, CLOSE, LISTENING } = SOCKET_EVENTS

const sessions = new Map()

export const initWebSocketServer = (server, routes) => {
  if(!routes) throw new Error('Routes are required')
        
  const wss = new WebSocketServer({ server });

  const flatByProp = (obj, prop) => Object.entries(obj).reduce((acc, [key, route]) => ({...acc, [key]: route[prop]}), {})

  const guards = flatByProp(routes, 'guards')
  const controllers = flatByProp(routes, 'controller')
  const defaultRoute = Object.entries(routes).find(([key, route]) => route?.default)?.[0]
  const disconnectRoute = Object.entries(routes).find(([key, route]) => route?.disconnect)?.[0]
  if (!defaultRoute) throw new Error('Default route is required')

  wss.on(CONNECTION, (ws) => {

    const session = {
      id: Math.random().toString(36).slice(2, 9),
      ws,
      emit: (type, payload) => emit(session, { type, payload }),
      goto: (routeName) => router.transition(routeName)
    }

    sessions.set(session.id, session)
    const router = new StateMachine(controllers, defaultRoute, session)

    ws.on(MESSAGE, (data) => {
      console.log(MESSAGE, data.toString())
      const d = JSON.parse(data)
      if(runGuards(guards[router.currentState], session, d?.type, d?.payload, router.currentState)) {
        router.dispatch(d?.type, d?.payload)
      }
    })

    ws.on(CLOSE, () => router?.transition?.(disconnectRoute));
  })

  wss.on(LISTENING, () => {
    console.log(`Server started at ${WS_URL}`)
  })
}

export const emit = (session, data) => {
  console.log(data)
  session?.ws?.send?.(JSON.stringify(data))
}