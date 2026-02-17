import { GameController } from "../controller/game.solo.controller.js";
import { HomeController } from "../controller/home.controller.js";
import { CONTEXTS } from "../../shared/contants.shared.js";
import { Guards } from "./guards.js";
import { DisconnectController } from "../controller/disconnect.controller.js";

const { ActionGuard } = Guards
const { HOME, GAME, DISCONNECT } = CONTEXTS

export const Routes = {
 [HOME]: {
   default: true,
   guards: [
      ActionGuard(['solo'])
   ],
   controller: HomeController
 },
 [GAME]: {
   controller: GameController
 },
 [DISCONNECT]: {
   disconnect: true,
   controller: DisconnectController
 }
}