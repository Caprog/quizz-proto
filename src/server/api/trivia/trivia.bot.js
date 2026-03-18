

export class TriviaBot {

    selectedAnswer = null

    constructor() {
        
    }

    onMessage({ type, payload }, { send, close }) {
        if (type === 'sync') {
            if (payload.game.phase === 'question') {
                this.selectedAnswer = payload.game.data.options[Math.floor(Math.random() * payload.game.data.options.length)].value
                send('select', this.selectedAnswer)
            }
        }
    }
}
  