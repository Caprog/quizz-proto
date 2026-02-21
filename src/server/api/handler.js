import GameController from "./controller/game.controller.js";
import HomeController from "./controller/home.controller.js";
import { CONTEXTS } from "../../shared/contants.shared.js";
import { StateMachine } from "../core/state.machine.js";
import { SimpleActionGuard } from "./guards/action.guard.js";
import { runGuards } from "../core/core.utils.js";

const { HOME, GAME } = CONTEXTS

const ContextHandlers = {
 [HOME]: HomeController,
 [GAME]: GameController
}

const Guards = {
 [HOME]: [SimpleActionGuard(['solo'])]  
}


const machines = new Map()

const onMessage = async (context, { type, payload }) => {
  const machine = machines.get(context.id)
  console.log('onMessage', type, payload)
  console.log('currentState', machine.currentState)
  const guards = Guards[machine.currentState]
  const guardResult = await runGuards(guards, { context, type, payload })
  
  if (guardResult) {
    context.emit('error', {
      context: machine.currentState,
      payload: guardResult
    })
    return
  }

  machine.send(context, { type, payload })
}

const onConnection = (context) => {
  const machine = new StateMachine(ContextHandlers, HOME)
  machine.transition(context, HOME)
  machines.set(context.id, machine)
}

const onDisconnect = () => {}

export {
  onConnection,
  onMessage,
  onDisconnect
}
