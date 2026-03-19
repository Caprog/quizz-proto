import { WebSocket } from "ws"
import { WS_URL } from "../shared/contants.shared.js"

const BOTS_COUNT = 5
const MIN_DELAY = 2000
const MAX_DELAY = 10000

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
            console.log('data', { type, payload })
            if (type === 'sync') {
                if (payload.game?.phase === 'question') {
                    console.log('payload.game.data', payload.game.data)
                    this.ws.send(JSON.stringify({ type: 'select', payload: payload.game.data.options[Math.floor(Math.random() * payload.game.data.options.length)].value }))
                }
            }
        })

        this.ws.on('close', () => {
            console.log('Disconnected...')
            // retry between 2000 and 5000 ms
            setTimeout(() => {
                console.log('Reconnecting...')
                this.connect()
            }, Math.floor(Math.random() * (5000 - 2000 + 1) + 2000))
        })

        this.ws.on('error', (error) => {
            // console.error('Error:', error)
        })
    }
}


for (let i = 0; i < BOTS_COUNT; i++) {
    setTimeout(() => {
        const bot = new Bot(i)
        bot.connect()
    }, Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1) + MIN_DELAY))
}