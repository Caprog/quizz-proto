import { SCOPES } from "../../contants.shared.js";
import { PlayersService } from "../service/players.service.js";
import { WebSocketService } from "../service/ws.service.js";
import { Routes } from "./routes.js";

export const dispatch = ({ playerId, type, payload }) => {
    const player = PlayersService.getPlayer(playerId)

    const route = Routes[player?.context]
    if (!route) return

    const result = route?.handle?.(playerId, type, payload)
    if (!result) return

    if (result?.context && result?.context !== player?.context){
        switchContext(playerId, result?.context)
    } else {
        emit(playerId, result)
    }
}

export const switchContext = (playerId, newContext) => {
    const player = PlayersService.getPlayer(playerId)
    if (!player) return

    emit(playerId, Routes[player?.context]?.exit?.(playerId))

    player.context = newContext
    PlayersService.updatePlayer(playerId, player)

    emit(playerId, Routes[newContext]?.enter?.(playerId))
}

export const emit = (playerId, result) => {
    if(!result || !result.scope) return

    if (result.scope === SCOPES.BROADCAST) {
        result.recipients?.forEach?.(syncPlayer)
    }

    if (result.scope === SCOPES.PRIVATE) {
        syncPlayer(playerId)
    }
}

export const syncPlayer = (playerId) => {
    const player = PlayersService.getPlayer(playerId)
    const route = Routes[player?.context]

    if (!player?.ws || !route?.sync) return

    const data = {
        context: player?.context,
        ...route?.sync?.(playerId)
    }

    console.log('sync', data)

    WebSocketService.send(
        player?.ws, 
        'sync', 
        data
    )
}