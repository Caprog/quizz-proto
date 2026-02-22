import { PHASES } from "../../types.js"

const handle = ({ game, me }, { type, payload }) => {
    const handlers = {
        next: () => PHASES.SCORE
    }

    return handlers[type]?.()
}

const enter = ({ game, me }) => {
    
    game.questions[game.currentQuestionIndex].options.forEach((option, index) => {
        if(option.isCorrect && me.selectedAnswer === option.value) {
            game.correctAnswers = option
        }
    })
    me.actions = {
        next: { type: 'next' }
    }
}

const exit = (context) => {}

const view = ({ game, me }) => {
    return {
        data: {
            
        }
    }
}

export const FeedbackPhase = {
    enter,
    exit,
    handle,
    view
}


