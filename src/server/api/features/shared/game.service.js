import { Trivia } from "../trivia/trivia.js"

const games = new Map()

const matchmaking = new Map()

const createAndGet = async ({ playerId, type, emit } = {}) => {
    if(!emit || !type) return

    const room_code = Math.random().toString(36).substring(2, 6)
    const game = new Trivia(
            { 
                maxPlayers: 8, 
                room_code,
                gameStartTimer: 5000,
                matchmakingTimer: 5000,
                feedbackTimer: 5000,
                confirmationTimer: 10000,
                totalQuestions: 3
            },
            { emit },
        )

    games.set(room_code, game)

    return game
}

const findAvailableGameOrReconnect = async (args) => {
    let game = null 
    if(matchmaking.has(args.playerId)) {
        game = games.get(matchmaking.get(args.playerId))
    }

    if(game) {
        game.join(args.playerId, args.isBot)
        return game
    }

    game = games
        .values()
        .find(game => game.state !== 'game_over' && game.canJoin(args.playerId, args.isBot)) 

    if(!game) {
        if(args.isBot) return
        game = await createAndGet(args)
    }

    if (matchmaking.has(args.playerId) && matchmaking.get(args.playerId) !== game.config.room_code) {
        // Player was in another game, update matchmaking
    }

    game.join(args.playerId, args.isBot)

    matchmaking.set(args.playerId, game.config.room_code)

    return game
}

// Cleanup stale games every minute
setInterval(() => {
    for (const [code, game] of games.entries()) {
        if (game.state === 'game_over') {
            console.log(`Cleaning up game ${code}`)
            games.delete(code)
            // Optional: clear matchmaking for players in this game
            for (const [pid, rcode] of matchmaking.entries()) {
                if (rcode === code) matchmaking.delete(pid)
            }
        }
    }
}, 60000)

const findByRoomCode = (room_code) => {
    return games.get(room_code)
}

export default {
    findByRoomCode,
    findAvailableGameOrReconnect,
    findByPlayerId: (playerId) => games.get(matchmaking.get(playerId))
}