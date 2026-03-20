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

class Bot {
    constructor(id) {
        this.id = id
        this.ws = null
        this.reconnectTimer = null
    }

    connect() {
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            return
        }

        this.clearReconnectTimer()
        
        this.ws = new WebSocket(WS_URL)

        this.ws.on('open', () => {
            console.log(`[Bot ${this.id}] Connected to game server`)
        })

        this.ws.on('message', (data) => {
            this.handleMessage(data)
        })

        this.ws.on('close', () => {
            console.log(`[Bot ${this.id}] Disconnected.`)
            this.scheduleReconnect()
        })

        this.ws.on('error', (err) => {
            console.error(`[Bot ${this.id}] Connection error: ${err.message}`)
            // Terminate triggers close event
            this.ws.terminate()
        })
    }

    handleMessage(data) {
        try {
            const { type, payload } = JSON.parse(data)
            if (type === 'sync' && payload.game?.phase === 'question') {
                setTimeout(() => {
                    if (this.ws?.readyState === WebSocket.OPEN) {
                        const options = payload.game.data.options
                        if (options && options.length > 0) {
                            const randomOption = options[Math.floor(Math.random() * options.length)]
                            this.ws.send(
                                JSON.stringify({
                                    type: 'select',
                                    payload: randomOption.value
                                })
                            )
                        }
                    }
                }, randomBetween(MIN_QUESTION_DELAY, MAX_QUESTION_DELAY))
            }
        } catch (error) {
            console.error(`[Bot ${this.id}] Error handling message:`, error.message)
        }
    }

    scheduleReconnect() {
        if (this.reconnectTimer) return

        const delay = randomBetween(MIN_RECONNECT_DELAY, MAX_RECONNECT_DELAY)
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null
            console.log(`[Bot ${this.id}] Reconnecting...`)
            this.connect()
        }, delay)
    }

    clearReconnectTimer() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer)
            this.reconnectTimer = null
        }
    }
}

for (let i = 0; i < BOTS_COUNT; i++) {
    setTimeout(() => {
        const bot = new Bot(i)
        bot.connect()
    }, randomBetween(MIN_DELAY, MAX_DELAY))
}
