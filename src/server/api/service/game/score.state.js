import { PHASES } from "../../types.js"

const handle = ({ game, me }, { type, payload }) => {
    const handlers = {
        next: () => {
            if(game.currentQuestionIndex < game.questions.length) 
                return PHASES.QUESTION
            return PHASES.END
        }
    }

    return handlers[type]?.()
}

const enter = ({ game, me }) => {
    if(me.selectedAnswer !== game.correctAnswers.value) {
        me.gainedPoints = 10
        me.score += me.gainedPoints
    } else {
        me.gainedPoints = 0
    }

    me.actions = {
        next: { type: 'next' }
    }
}

const exit = (context) => {}

const view = ({ game, me }) => {
    return {
        
    }
}

export const ScorePhase = {
    enter,
    exit,
    handle,
    view
}


