import { GameController } from "../controller/game.solo.controller.js";
import { HomeController } from "../controller/home.controller.js";
import { CONTEXTS } from "../../shared/contants.shared.js";
import { Guards } from "./guards.js";

const { ActionGuard } = Guards
const { HOME, GAME } = CONTEXTS

export const Routes = {
 [HOME]: {
    controller: HomeController,
    guards: [ActionGuard]    
 },
 [GAME]: {
    controller: GameController,
    guards: [ActionGuard]
 }
}