

export class TriviaBot {

    constructor() {
        this.id = 'bot_' + Math.random().toString(36).slice(2, 9)
    }

    onMessage({ type, payload }, { send }) {
        if (type === 'sync') {
            if (payload.game.phase === 'question') {
                // send('select', payload.game.data.options[0].value)
                // send('confirm')
                // return
            }
        }
    }
}
  