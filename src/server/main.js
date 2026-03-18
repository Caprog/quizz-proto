import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { PORT, WS_URL } from '../shared/contants.shared.js'
import { initWebSocketServer } from './core/ws.server.js'
import { game, onConnection, onDisconnect, onMessage } from './api/trivia/trivia.ws.js'
import botService from './api/shared/bot.service.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))
app.use('/shared', express.static(path.join(__dirname, '../shared')))
app.get('/api/game', (req, res) => {
  res.json({
    type: 'sync',
    status: 200,
    payload: game?.getState() ?? {}
  })
})

const server = app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
    console.log(`WebSocket URL: ${WS_URL}`)
    console.log(`webPage URL: http://localhost:${PORT}`)
    initWebSocketServer(server, { onConnection, onMessage, onDisconnect })
    botService.start()
})


