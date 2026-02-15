import { PlayersService } from "./players.service.js"
import { QuestionService } from "./question.service.js"

const games = new Map()

const createGame = (id) => {
  const questions = QuestionService.getRandomQuestions(3)

  games.set(id, {
    id,
    players: [],
    phase: 'lobby',
    questions
  })
}

const addPlayer = (id, state) => {
  games.get(id).players.push(state)
}

const getGame = (id) => {
  return games.get(id)
}

const saveGame = (id, game) => {
    games.set(id, game)
}

const startGame = (id) => {
    const game = games.get(id)
    game.phase = 'question'
    game.questions = QuestionService.getRandomQuestions(3)
    game.currentQuestion = 0

    const question = game.questions[game.currentQuestion]
    game.data = {
        type: 'single',
        text: question.question,
        options: question.options
    }

    saveGame(id, game)
}

const handleQuestion = (playerId, type, payload) => {
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
            
            delete player.me.selection

            saveGame(id, game)
            PlayersService.updatePlayer(id, player)
        },
    }

    handlers[type]?.(playerId, type, payload)
}

const handleProgress = (_playerId, _type, _payload) => {
    const handlers = {

    }
}

const phases = {
    question: handleQuestion,
    progress: handleProgress
}

const getActions = (playerId) => {
    const game = games.get(playerId)
    
    const commonActions = {
        leave: { type: 'leave' }
    }

    if (game.phase === 'question') {

        return {
            ...commonActions,
            select: { type: 'select' },
            confirm: { type: 'confirm' }
        }

    }

    return commonActions
}

const handle = (playerId, type, payload) => {
    const game = games.get(playerId)
    
    if(type === 'leave') {
        removeGame(playerId)
        return
    }

    phases[game.phase]?.(playerId, type, payload)
}

const removeGame = (playerId) => {
    games.delete(playerId)
}

export const GameService = { 
    createGame,
    addPlayer,
    getGame,
    startGame,
    handle,
    getActions,
    removeGame
}