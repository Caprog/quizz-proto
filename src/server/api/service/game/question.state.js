import { PHASES } from "../../types.js"

const handle = ({ game, me }, { type, payload }) => {
    const handlers = {
        select: () => {
            if(!payload.value) return
            me.selectedAnswer = payload.value
        },
        confirm: () => {
            if(!me.selectedAnswer) return
            me.confirmed = true
        }
    }

    handlers[type]?.()

    if(me.confirmed) return PHASES.FEEDBACK
}

const enter = ({ game, me }) => {
    game.currentQuestion = game.questions[game.currentQuestionIndex]
    game.currentQuestionIndex++
}

const exit = (context) => {}

const view = ({ game, me }) => {
    return {
        text: game.currentQuestion.question,
        options: game.currentQuestion.options
    }
}

export const QuestionPhase = {
    enter,
    exit,
    handle,
    view
}


