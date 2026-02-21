import GameController from "./controller/game.controller.js";
import HomeController from "./controller/home.controller.js";
import { CONTEXTS } from "../../shared/contants.shared.js";
import { StateMachine } from "../core/state.machine.js";

const { HOME, GAME } = CONTEXTS

const ContextHandlers = {
 [HOME]: HomeController,
 [GAME]: GameController
}

const machines = new Map()

const onMessage = async (context, { type, payload }) => {
  const machine = machines.get(context.id)
  console.log('onMessage', type, payload)
  console.log('currentState', machine.currentState)
  const result = await machine.send(context, { type, payload })
 
  if (result) {
    context.emit('error', {
      context: machine.currentState,
      payload: result,
    })
    return
  }
  
  context.emit('sync', await machine.view(context)) 
}

const onConnection = async (context) => {
  const machine = new StateMachine(ContextHandlers, HOME)
  machine.transition(context, HOME)
  machines.set(context.id, machine)
  context.emit('sync', await machine.view(context)) 
}

const onDisconnect = () => {}

export {
  onConnection,
  onMessage,
  onDisconnect
}
