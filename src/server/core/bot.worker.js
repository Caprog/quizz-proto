import { parentPort, workerData } from 'node:worker_threads'
import { WebSocket } from 'ws'
import { TriviaBot } from '../api/features/trivia/trivia.bot.js'
import { WS_URL } from '../../shared/contants.shared.js'

const maxBots = 10
let aliveBots = []

const getRandomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const getRandom = () => getRandomBetween(2000, 8000)

const connectBot = () => {
  if (aliveBots.length >= maxBots) return

  const socket = new WebSocket(WS_URL, 'bot-protocol')
  const triviaBot = new TriviaBot()
  
  let isClosing = false
  aliveBots.push(socket)

  const cleanup = (noGameFound = false) => {
    if (isClosing) return
    isClosing = true
    
    aliveBots = aliveBots.filter(s => s !== socket)
    socket.terminate()
    
    const delay = noGameFound ? 30000 : getRandom()
    if (noGameFound) console.log(`No games found, bot waiting 30s...`)

    setTimeout(() => {
        if (aliveBots.length < maxBots) connectBot()
    }, delay)
  }

  socket.on('open', () => {
    console.log(`Bot connected (${aliveBots.length}/${maxBots})`)
    setTimeout(() => {
        if (aliveBots.length < maxBots) connectBot()
    }, getRandom())
  })

  socket.on('message', (data) => {
    try {
      if (isClosing) return
      const msg = JSON.parse(data)
      triviaBot.onMessage(msg, {
        send: (type, payload) => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type, payload }))
          }
        },
        close: () => cleanup()
      })
    } catch (err) {
      console.error('Error parsing message', err)
    }
  })

  socket.on('close', (code, reason) => {
    // If code is 1000 or similar normal closure, but happened quickly, might be "no game"
    // However, handler.js just calls session.close() which is likely 1000 or 1005
    cleanup()
  })
  socket.on('error', (err) => {
    console.log('Bot connection error:', err.message)
    cleanup()
  })
}

connectBot()