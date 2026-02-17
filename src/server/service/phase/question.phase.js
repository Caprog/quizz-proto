import { PlayersService } from "../players.service.js"
import { GameSoloService } from "../game.service.js"

const handle = (playerId, type, payload) => {
    const handlers = {
        select: (id, _type, payload) => {
            console.log('select', payload)
            const player = PlayersService.getPlayer(id)
            const game = GameSoloService.getGameState(id)
            const option = game?.data?.options?.find?.((option) => option.value === payload)
            if (!option) return

            player.me.selection = [payload]

            PlayersService.updatePlayer(id, player)
        },
        confirm: (id, _type, _payload) => {
            const player = PlayersService.getPlayer(id)
            if (!player?.me?.selection?.length) return
            
            const game = GameSoloService.getGameState(id)
            game.phase = 'feedback'
            
            GameSoloService.saveGame(id, game)
            PlayersService.updatePlayer(id, player)

            return {
                phase: 'feedback'
            }
        },
    }

    handlers[type]?.(playerId, type, payload)
}

const enter = (playerId) => {
    return {}
}

const exit = (playerId) => {
    return {}
}

const sync = (playerId) => {
    return {
        type: 'single',
        text: 'What is the capital of France?',
        options: [
            { text: 'Paris', value: 'paris' },
            { text: 'London', value: 'london' },
            { text: 'Berlin', value: 'berlin' },
            { text: 'Madrid', value: 'madrid' }
        ]
    }
}

const getActions = (playerId) => {
    return {
        select: { type: 'select' },
        confirm: { type: 'confirm' }
    }
}

export const QuestionPhase = {
    enter,
    exit,
    sync,
    getActions,
    handle
}


