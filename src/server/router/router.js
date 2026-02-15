import { SCOPES } from "../../shared/contants.shared.js";
import { PlayersService } from "../service/players.service.js";
import { WebSocketService } from "../service/ws.service.js";
import { Routes } from "./routes.js";

export const dispatch = ({ playerId, type, payload }) => {
    console.log(playerId, type, payload)
    const player = PlayersService.getPlayer(playerId)

    const route = Routes[player?.context]
    if (!route?.controller) return

    const { controller, guards } = route

    for (const guard of guards) {
        const guardResult = guard?.(playerId, type, controller)
        if (guardResult) {
            emit(playerId, {
                type: 'GUARD_REJECTED', 
                ...guardResult 
            })
            return
        }
    }

    console.log('dispatch controller', controller)

    const result = controller?.handle?.(playerId, type, payload)
    if (!result) return

    if (result?.context && result?.context !== player?.context){
        switchContext(playerId, result?.context)
    } else {
        emit(playerId, result)
    }
}

const getController = (playerId) => {
    const player = PlayersService.getPlayer(playerId)
    return Routes[player?.context]?.controller
}

export const switchContext = (playerId, newContext) => {
    const player = PlayersService.getPlayer(playerId)
    if (!player) return

    console.log('switchContext', newContext)

    emit(playerId, getController(playerId)?.exit?.(playerId))

    player.context = newContext
    PlayersService.updatePlayer(playerId, player)

    // TODO: handle redirect context when enter in a new context in the future
    emit(playerId, getController(playerId)?.enter?.(playerId))
}

export const emit = (playerId, result) => {
    if (!result || !result.scope) return

    const type = result?.type ?? 'sync'

    const resolveData = (playerId) => {
        const player = PlayersService.getPlayer(playerId)
        const route = Routes[player?.context]

        const data = result?.payload ? 
            { payload: result?.payload } : 
            route?.controller?.sync?.(playerId)

        return {
            context: player?.context,
            type,
            ...data
        }
    }

    if (result.scope === SCOPES.BROADCAST) {
        result.recipients?.forEach?.(
            (playerId) => notifyPlayer(playerId, type, resolveData(playerId))
        )
    }

    if (result.scope === SCOPES.PRIVATE) {
        notifyPlayer(playerId, type, resolveData(playerId))
    }
}

export const notifyPlayer = (playerId, type, payload) => {
    const player = PlayersService.getPlayer(playerId)
    if (!player?.ws) return

    console.log('syncPlayer', type, payload)

    WebSocketService.send(
        player?.ws, 
        type, 
        payload
    )
}