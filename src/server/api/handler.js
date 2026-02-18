import GameController from "./controller/game.controller.js";
import HomeController from "./controller/home.controller.js";
import { CONTEXTS } from "../../shared/contants.shared.js";
import { StateMachine } from "../core/state.machine.js";

const { HOME, GAME } = CONTEXTS

export const ContextHandlers = {
 [HOME]: HomeController,
 [GAME]: GameController
}

const machine = new StateMachine(ContextHandlers, HOME)

const onMessage = ({ session, type, payload }) => {
  machine.dispatch(session, type, payload)
}

const onConnection = (session) => {
  machine.transition(session, HOME)
}

const onDisconnect = () => {}

export {
  onConnection,
  onMessage,
  onDisconnect
}
