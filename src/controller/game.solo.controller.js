import { SCOPES } from "../contants.shared.js"
import { GameService } from "../service/game.service.js"
import { PlayersService } from "../service/players.service.js"

const { BROADCAST } = SCOPES

export const GameController = {
  enter(playerId) {
    GameService.createGame(playerId)
    GameService.addPlayer(playerId, playerId)
    GameService.startGame(playerId)

    return {
      scope: BROADCAST,
      recipients: [playerId]
    }
  },

  sync(playerId) {
    const game = GameService.getGame(playerId)
    const player = PlayersService.getPlayer(playerId)
    return {
      game: {
        type: 'solo',
        phase: game.phase,
        data: game.data
      },
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
      scope: BROADCAST,
      context: exist ? 'game' : 'home',
      recipients: [playerId]
    }
  },

  disconnect(playerId) {
    GameService.removeGame(playerId)
    return {
      scope: BROADCAST,
      recipients: [playerId]
    }
  }
}
