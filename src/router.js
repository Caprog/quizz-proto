import { CONTEXTS, SCOPES } from "./contants.shared.js";
import { PlayersService } from "./service/players.service.js";
import { WebSocketService } from "./service/ws.service.js";
import { GameController } from "./controller/game.solo.controller.js";
import { HomeController } from "./controller/home.controller.js";

const { HOME, GAME } = CONTEXTS

const Routes = {
 [HOME]: HomeController,
 [GAME]: GameController
}

export const dispatch = ({ playerId, type, payload }) => {
    const player = PlayersService.getPlayer(playerId)

    const route = Routes[player?.context]
    if (!route) return

    let result = route?.handle?.(playerId, type, payload)

    if (result?.context !== player?.context){
     result = enter(playerId, result?.context)
    } 

    broadcast(result)
}

export const broadcast = (options) => {
    if(!options) return
    const { scope, recipients } = options
    if (scope === SCOPES.BROADCAST) {
        recipients.forEach((recipient) => {
            const player = PlayersService.getPlayer(recipient)
            if(!player?.ws) return
            const route = Routes[player?.context]
            if (!route) return
            WebSocketService.send(player?.ws, 'sync', {
                context: player?.context,
                ...route?.sync?.(recipient)
            })
        })
    }
}

/**
 * 
 * @param {string} playerId 
 * @param {string} context 
 * @returns { scope: string, recipients: string[], context: string } 
 */
export const enter = (playerId, context) => {
    const player = PlayersService.getPlayer(playerId)
    if (!player) return {}

    player.context = context

    PlayersService.updatePlayer(playerId, player)

    const route = Routes[context]
    if (!route) return

    return route.enter?.(playerId)
}