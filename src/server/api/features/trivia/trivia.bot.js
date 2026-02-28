

export class TriviaBot {

    selectedAnswer = null

    constructor() {
        this.id = 'bot_' + Math.random().toString(36).slice(2, 9)
    }

    onMessage({ type, payload }, { send, close }) {
        if (type === 'sync') {
            if (payload.game.phase === 'question') {
                 if (!payload.me?.selectedAnswer && !this.selectedAnswer) {
                    const randomOption = payload.game.data.options[Math.floor(Math.random() * payload.game.data.options.length)]
                    this.selectedAnswer = randomOption.value
                    send('select', randomOption.value)
                 } else {
                     if (!payload.me?.confirmed && this.selectedAnswer) {
                         send('confirm')
                     }
                 }

            }

            if (payload.game.phase === 'feedback') {
                this.selectedAnswer = null
            }

            if (payload.game.phase === 'game_over') {
                console.log(`Bot ${this.id} reached game over, disconnecting...`)
                close?.()
            }
        }
    }
}
  