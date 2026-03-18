import { Trivia } from "./features/trivia/trivia.js"

let game = null

const onMessage = async (session, { type, payload }) => {
  game?.handle(session.id, { type, payload })
}

const onConnection = async (session) => {
 if(!game) {
  game = new Trivia(
          { 
              totalQuestions: 10
          },
          { emit: (args) => session.emit(args) },
      )
 }

 game.join(session.id)
}

const onDisconnect = (session) => {
  game.leave(session.id)
}

export {
  onConnection,
  onMessage,
  onDisconnect
}
