import { CONTEXTS } from "../../../shared/contants.shared.js"
import { PHASES } from "../types.js"
import { QuestionPhase } from "../service/game/question.state.js"
import { QuestionService } from "../service/question.service.js"
import { FeedbackPhase } from "../service/game/feedback.state.js"
import { StateMachine } from "../../core/state.machine.js"
import { ScorePhase } from "../service/game/score.state.js"

const games = new Map()

const { QUESTION, FEEDBACK, SCORE, END } = PHASES


const STATES = {
  [QUESTION]: QuestionPhase,
  [FEEDBACK]: FeedbackPhase,
  [SCORE]: ScorePhase,
  [END]: {}
}

const TRANSITIONS = {
  [QUESTION]: {
    target: FEEDBACK,
    guard: (state) => state.me.confirmed === true
  }
}

const ACTIONS = {
  [QUESTION]: {
    select: { type: 'select' },
    confirm: { type: 'confirm' },
    leave: { type: 'leave' }
  },

  [FEEDBACK]: {
    next: { type: 'next' },
    leave: { type: 'leave' }
  }
}

export default {
  async enter({ id, emit }) {
    const machine = new StateMachine(STATES) 
    games.set(id, { 
      id,
      emit,
      machine,
      state: {
        game: {
          type: 'solo',
          phase: QUESTION,
          questions: QuestionService.getRandomQuestions(3),
          currentQuestionIndex: 0
        },
        me: {
          score: 0,
          actions: ACTIONS[QUESTION]
        } 
      } 
    })

    await machine.transition(games.get(id).state, QUESTION)
    const state = await this.view({ id })
    console.log('state', state)
    emit('sync', state)
  },

  async view({ id }) {
    const game = games.get(id)
    if (!game) return

    return {
      context: 'game',
      
      game: {
        phase: game.machine.currentState,
        data: await game.machine.view(game.state),
      },

      me: {
        ...game.state.me,
        actions: ACTIONS[game.machine.currentState]
      }
    }
  },

  
  async handle({ id, emit }, { type, payload }) {
    if(!id) return
    
    const game = games.get(id)
    if (!game) return

    if(!game.state.me?.actions?.[type]) return

    if (type === 'leave') return CONTEXTS.HOME

    await game.machine.send(game.state, { type, payload })

    if(game.state.game.phase === END) return CONTEXTS.HOME
    
    const state = await this.view({ id })
    console.log('state', state)
    emit('sync', state)
  },

  exit({ id }) {
    games.delete(id)
  }
}
