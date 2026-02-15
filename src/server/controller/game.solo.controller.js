import { CONTEXTS, SCOPES } from "../../contants.shared.js"
import { GameService } from "../service/game.service.js"
import { PlayersService } from "../service/players.service.js"

const { PRIVATE } = SCOPES

export const GameController = {
  enter(playerId) {
    GameService.createGame(playerId)
    GameService.addPlayer(playerId, playerId)
    GameService.startGame(playerId)

    return {
      scope: PRIVATE
    }
  },

  sync(playerId) {
    const game = GameService.getGame(playerId)
    const player = PlayersService.getPlayer(playerId)
    return {
      game: game ? {
        type: 'solo',
        phase: game.phase,
        data: game.data
      } : null,
      me: {
        ...player.me,
        actions: GameService.getActions(playerId)
      }
    }
  },
  
  handle(playerId, type, payload) {
    GameService.handle(playerId, type, payload)

    const exist = GameService.getGame(playerId)
    
    return {
      scope: PRIVATE,
      context: exist ? 'game' : 'home'
    }
  },

  exit(playerId) {
    GameService.removeGame(playerId)
    return null
  }
}
