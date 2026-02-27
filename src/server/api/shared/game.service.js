import { Trivia } from "../features/trivia/trivia.js"

const games = new Map()

const matchmaking = new Map()

const createAndGet = async ({ playerId, type, emit } = {}) => {
    if(!emit || !type) return

    const room_code = Math.random().toString(36).substring(2, 6)
    const game = new Trivia(
            { 
                maxPlayers: 16, 
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
        game.join(args.playerId)
        return game
    }

    game = games
        .values()
        .find(game => game.canJoin(args.playerId)) 
            ?? await createAndGet(args)

    game.join(args.playerId)

    matchmaking.set(args.playerId, game.config.room_code)

    return game
}

export default {
    findAvailableGameOrReconnect,
    findByPlayerId: (playerId) => games.get(matchmaking.get(playerId))
}