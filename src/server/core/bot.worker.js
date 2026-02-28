import { parentPort, workerData } from 'node:worker_threads'
import { WebSocket } from 'ws'
import { TriviaBot } from '../api/features/trivia/trivia.bot.js'
import { WS_URL } from '../../shared/contants.shared.js'


const maxBots = 12

const aliveBots = []

const getRandomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const getRandom = () => getRandomBetween(1000, 10000)

const connectBot = () => {
  const socket = new WebSocket(WS_URL, 'bot-protocol')
  const triviaBot = new TriviaBot()

  aliveBots.push(socket)
  socket.on('open', () => {
    console.log('Bot connected and searching...')
    if(aliveBots.length < maxBots) {
      setTimeout(connectBot, getRandom())
    }
  })

  socket.on('message', (data) => {
    try {
      const msg = JSON.parse(data)
      // Pass the socket send method to the bot logic
      triviaBot.onMessage(msg, {
        send: (type, payload) => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type, payload }))
          }
        }
      })
    } catch (err) {
      console.error('Error parsing message', err)
    }
  })

  socket.on('close', () => {
    setTimeout(connectBot, getRandom())
    aliveBots.pop()
  })

  socket.on('error', (err) => {
    console.log('Bot connection error:', err.message)
    socket.terminate()
    setTimeout(connectBot, getRandom())
    aliveBots.pop()
  })
}

connectBot()