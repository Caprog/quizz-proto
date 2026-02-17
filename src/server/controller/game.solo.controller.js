import { GameService } from "../service/game.service.js"
import { phases } from "../service/phase/phase.js"

export const GameController = {
  enter({ id, emit }) {
    GameService.createGame(id)
    GameService.addPlayer(id, {})
    GameService.startGame(id)
    this.sync({ id, emit })
  },

  sync({ id, emit }) {
    const game = GameService.getGameState(id)
    
    emit('sync', {
      game: game ? {
        type: 'solo',
        phase: game.phase,
        data: phases?.[game?.phase]?.sync(id)
      } : null,
      me: {
        actions: GameService.getActions(id)
      }
    })
  },
  
  handle({ id, emit }, type, payload) {
    GameService.handle(id, type, payload)

    this.sync({ id, emit })
  },

  exit({ id }) {
    GameService.removeGame(id)
  }
}
