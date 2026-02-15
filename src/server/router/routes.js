import { GameController } from "../controller/game.solo.controller.js";
import { HomeController } from "../controller/home.controller.js";
import { CONTEXTS } from "../../contants.shared.js";

const { HOME, GAME } = CONTEXTS

export const Routes = {
 [HOME]: HomeController,
 [GAME]: GameController
}