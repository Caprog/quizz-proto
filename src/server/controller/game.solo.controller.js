import { CONTEXTS } from "../../shared/contants.shared.js"
import { GameSoloService } from "../service/game.service.js"
import { phases } from "../service/phase/phase.js"

export const GameController = {
  enter({ id, emit }) {
    GameSoloService.createGame(id)
    this.sync({ id, emit })
  },

  sync({ id, emit }) {
    const game = GameSoloService.getGameState(id)
    
    emit('sync', {
      context: 'game',
      game: game ? {
        type: 'solo',
        phase: game.phase,
        data: phases?.[game?.phase]?.sync(id)
      } : null,
      me: {
        actions: GameSoloService.getActions(id)
      }
    })
  },
  
  handle({ id, emit }, type, payload) {

    if (type === 'leave') {
      return CONTEXTS.HOME
    }

    GameSoloService.handle(id, type, payload)

    this.sync({ id, emit })
  },

  exit({ id }) {
    GameSoloService.removeGame(id)
  }
}
