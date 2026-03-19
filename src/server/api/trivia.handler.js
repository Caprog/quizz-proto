import { QUESTIONS } from "./trivia.data.js"

const getRandomQuestions = (count = 3) => {
  return shuffle(QUESTIONS)
    .slice(0, count)
    .map(({ question, options }) => ({
      question,
      options: shuffle(options)
    }))
}

const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5)
}

export const enter_game_start = (game) => {
    game.data = {
        questionIndex: -1,
        questions: getRandomQuestions(game.config.questionsCount)
    }

    Object.values(game.players).forEach(player => {
        player.score = 0
        delete player.selectedAnswer
    })
}

export const enter_question = ({ data, config, players }) => {
    if(data.questionIndex === -1 || 
        data.questionIndex + 1 === config.questionsCount) {
        data.questions = getRandomQuestions(config.questionsCount)
    }

    data.questionIndex++
    data.currentQuestion = data.questions[data.questionIndex]
    data.correctAnswer = data.currentQuestion?.options?.find(option => option.isCorrect)?.value

    Object.values(players).forEach(player => {
        player.selectedAnswer = null
    })
}

export const view_question_data = ({ data }) => {
    return {
        text: data.currentQuestion?.question,
        options: data.currentQuestion?.options?.map(option => ({
            text: option.text,
            value: option.value
        }))
    }
}

export const handle_question = (game, playerId, { type, payload }) => {
    console.log('playerId', playerId, 'type', type, 'payload', payload)
    const player = game.players[playerId]
    if(!player) return

    if(type === 'select' && 
        game.data.currentQuestion
            ?.options
            ?.find(option => option.value === payload)){
        player.selectedAnswer = payload
    }
}

export const enter_feedback = (game) => {
    Object.values(game.players).forEach(player => {
        player.score += player?.selectedAnswer === game.data?.correctAnswer ? 1 : 0
    })
}