import { shuffle } from "../../../shared/utils.shared.js"
import { QUESTIONS } from "../data/questions.js"

const getRandomQuestions = (count = 3) => {
    return shuffle(QUESTIONS)
      .slice(0, count)
      .map(({ question, options }) => ({
        question,
        options: shuffle(options)
      }))
  }


export const QuestionService = {
  getRandomQuestions
}