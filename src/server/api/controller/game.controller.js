import { CONTEXTS } from "../../../shared/contants.shared.js"
import { PHASES } from "../types.js"
import { QuestionPhase } from "../service/game/question.state.js"
import { QuestionService } from "../service/question.service.js"
import { FeedbackPhase } from "../service/game/feedback.state.js"
import { StateMachine } from "../../core/state.machine.js"
import { ScorePhase } from "../service/game/score.state.js"
import { ActionGuard } from "../guards/action.guard.js"

const games = new Map()

const { QUESTION, FEEDBACK, SCORE, END } = PHASES

const STATES = {
  [QUESTION]: QuestionPhase,
  [FEEDBACK]: FeedbackPhase,
  [SCORE]: ScorePhase,
  [END]: {}
}

const ACTIONS = {
  'leave': { type: 'leave', target: CONTEXTS.HOME }
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
          questions: QuestionService.getRandomQuestions(3),
          currentQuestionIndex: 0
        },
        me: {
          score: 0
        } 
      } 
    })

    await machine.transition(games.get(id).state, QUESTION)
  },

  async view({ id }) {
    const game = games.get(id)
    const { data, actions } = await game.machine.view(game.state) ?? {}
    return {
      context: 'game',
      
      game: {
        type: 'solo',
        phase: game.machine.currentState,
        data,
      },

      me: {
        ...game.state.me,
        actions: {
          ...ACTIONS,
          ...actions
        }
      }
    }
  },


  guards: [
    // check id
    ({ id }) => !id && {
      type: 'INVALID_GAME_ID',
      id
    },
    // check game exists or error
    ({ id }) => !games.get(id) && {
        type: 'GAME_NOT_FOUND',
        id
      },
    // check actions
    ({ id }, { type }) => ActionGuard(games.get(id).state.me)({ id }, { type })
  ],

  async handle({ id, emit }, { type, payload }) {
    const game = games.get(id)

    const target = ACTIONS[type]?.target
    if(target) return target

    const result = await game.machine.send(game.state, { type, payload })
    if(result) return result
  },

  next: {
    [CONTEXTS.HOME] : ({ id }) => games.get(id)?.state?.game.phase === END 
  },

  exit({ id }) {
    games.delete(id)
  }
}
