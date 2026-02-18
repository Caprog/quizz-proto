import { PlayersService } from "./players.service.js"
import { QuestionService } from "./question.service.js"
import { phases } from "./phase/phase.js"

const games = new Map()

const createGame = (id) => {
  const questions = QuestionService.getRandomQuestions(3)

  games.set(id, {
    id,
    players: [],
    phase: 'lobby',
    questions
  })

  addPlayer(id, {})
  startGame(id)
}

const addPlayer = (id, state) => {
  games.get(id).players.push(state)
}

const getGameState = (id) => {
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

const getActions = (playerId) => {
    const game = games.get(playerId)
    const phase = phases?.[game?.phase]
    const commonActions = {
        leave: { type: 'leave' }
    }

    return {
        ...commonActions,
        ...phase?.getActions(playerId) ?? {}
    }
}

const handle = (playerId, type, payload) => {
    const game = games.get(playerId)
    
    if(type === 'leave') {
        removeGame(playerId)
        return
    }

    phases?.[game?.phase]?.handle(playerId, type, payload)
}

const removeGame = (playerId) => {
    games.delete(playerId)
}

export const GameSoloService = { 
    createGame,
    getGameState,
    handle,
    getActions,
    removeGame
}