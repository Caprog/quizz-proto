import { QUESTIONS } from "./data/questions.js"

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

export const QuestionService = {
  getRandomQuestions
}

