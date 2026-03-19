import { WebSocket } from "ws"
import { WS_URL } from "../shared/contants.shared.js"

const BOTS_COUNT = 5
const MIN_DELAY = 2000
const MAX_DELAY = 10000
const MIN_QUESTION_DELAY = 6000
const MAX_QUESTION_DELAY = 10000
const MIN_RECONNECT_DELAY = 2000
const MAX_RECONNECT_DELAY = 5000

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

// create 
class Bot {
    constructor(id) {
        this.id = id
    }

    connect() {
        if (this.ws?.readyState === WebSocket.OPEN) {
            return
        }

        this.ws = new WebSocket(WS_URL)

        this.ws.on('open', () => {
            console.log('Connected to game server')
        })

        this.ws.on('message', (data) => {
            const { type, payload } = JSON.parse(data)
            if (type === 'sync') {
                if (payload.game?.phase === 'question') {
                    setTimeout(() => {
                        this.ws.send(
                            JSON.stringify({
                                type: 'select',
                                payload: payload.game.data.options[
                                    Math.floor(Math.random() * payload.game.data.options.length)
                                ].value
                            })
                        )
                    }, randomBetween(MIN_QUESTION_DELAY, MAX_QUESTION_DELAY))
                }
            }
        })

        this.ws.on('close', () => {
            console.log('Disconnected...')
            setTimeout(() => {
                console.log('Reconnecting...')
                this.connect()
            }, randomBetween(MIN_RECONNECT_DELAY, MAX_RECONNECT_DELAY))
        })

        this.ws.on('error', () => {
            try {
                this.ws?.close?.()
            } catch (error) {
                // ignore
            }
        })
    }
}


for (let i = 0; i < BOTS_COUNT; i++) {
    setTimeout(() => {
        const bot = new Bot(i)
        bot.connect()
    }, randomBetween(MIN_DELAY, MAX_DELAY))
}