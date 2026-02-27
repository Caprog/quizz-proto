import { onConnection, onMessage } from "../handler.js";
import { TriviaBot } from "../features/trivia/trivia.bot.js";


export default {
 
    addBot(gameId) {
        
        const bot = new TriviaBot()

        const session = {
            id: bot.id,
            emit: (type, payload) => {
                bot.onMessage({ type, payload }, 
                    { 
                        send: (type, payload) => onMessage(session, { type, payload })
                    })
            }
        }

        onConnection(session)
    }
}