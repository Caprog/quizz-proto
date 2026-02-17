
const handle = (playerId, type, payload) => {
    const handlers = {
        select: (id, _type, payload) => {
            const player = PlayersService.getPlayer(id)
            const game = getGame(id)
            const option = game?.data?.options?.find?.((option) => option.value === payload)
            if (!option) return

            player.me.selection = [payload]

            PlayersService.updatePlayer(id, player)
        },
        confirm: (id, _type, _payload) => {
            const player = PlayersService.getPlayer(id)
            if (!player?.me?.selection?.length) return
            
            const game = getGame(id)
            game.phase = 'feedback'
            
            saveGame(id, game)
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
    return {}
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


