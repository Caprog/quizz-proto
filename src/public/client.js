import { WS_URL } from "../shared/contants.shared.js"
import { state } from "./src/store.js"
import { subscribe } from 'https://esm.sh/valtio'
import { Player } from "./src/player.entity.js"
import { Countdown } from "./src/countdown.entity.js"
import { PHASES } from "../shared/trivia.types.js"

const modalQuizEl = document.getElementById('modal-quiz')
const questionNumberEl = document.getElementById('question_number')
const topXEl = document.getElementById('top_x')
const messageEl = document.getElementById('message')
const questionsEl = document.getElementById('quiz-options')
const questionEl = document.getElementById('question')
const playersCountEl = document.getElementById('players_count')
const scoreEl = document.getElementById('score')
const spawnEl = document.getElementById('spawn')
const PLAYER_WIDTH = 4.13
const globalCountdown = new Countdown(document.getElementById('global_countdown_bar'))
const questionCountdown = new Countdown(document.getElementById('question_countdown_bar'))
const stairs = Array.from(document.querySelectorAll('.stair')).reverse()
let lastResponse = null
let you = null
let others = []

export const connect = (url, handlers) => {
  const ws = new WebSocket(url)

  ws.onopen = (args) => handlers.onopen?.(args)
  ws.onmessage = (data) => handlers.onmessage?.(JSON.parse(data?.data))
  ws.onclose = (args) => handlers.onclose?.(args)
  ws.onerror = (args) => handlers.onerror?.(args)

  const send = (type, payload) => {
    if (isReady()) ws.send(JSON.stringify({ type, payload }))
  }

  const isReady = () => ws.readyState === WebSocket.OPEN

  const close = () => ws.close()

  return {
    isReady,
    send,
    close
  }
}

const setup = () => {

  subscribe(state, () => {
    console.log(JSON.stringify(state.payload, null, 2))
  })
  
  const start = () => {
    const ws = connect(WS_URL, 
      {
        onopen: () => {

          if(!you) {
            
            you = new Player({ 
              name: '',
              y: -1,
              width: PLAYER_WIDTH,
              stairs,
              isYou: true
            })

            spawnEl.appendChild(you.el)
          }
        },
        onmessage: (data) => {
          const state = data?.payload

          messageEl.textContent = ""
          messageEl.classList.add('hidden')

          if(state?.game?.phase === PHASES.LOBBY) {
            messageEl.textContent = `Prépare-toi pour une nouvelle manche de questions`
            messageEl.classList.remove('hidden')
          }

          if(state?.game?.phase === PHASES.PREPARE_TO_QUESTION) {
            messageEl.textContent = `Prépare-toi pour la question ${state?.game?.questionNumber + 1}`
            messageEl.classList.remove('hidden')
          }

          if(state?.game?.phase === PHASES.FEEDBACK) {
            messageEl.textContent = `Calcul des scores...`
            messageEl.classList.remove('hidden')
          }

          if(state?.game?.phase === PHASES.SCORE) {
            messageEl.textContent = `Score mise à jour`
            messageEl.classList.remove('hidden')
          }
          
          questionNumberEl.textContent = `${state?.game?.questionNumber ?? 0}/${state?.game?.questionsCount}`
          // messageEl.textContent = state.payload?.game?.phase
          
          you.handle(data?.payload)

          scoreEl.textContent = `${state?.me?.score} pts`
          playersCountEl.textContent = `${state?.players_count} players`
          
          if(state?.game?.phase === PHASES.LOBBY) {
            
            //remove others
            others.forEach(other => {
              other.setScore(0)
              other.el.remove()
            })
            others = []
          
            you.setScore(0)
          }

          if(state?.game?.phase === PHASES.QUESTION) {
            const options = state?.game?.data?.options || []
            const option = options[Math.floor(Math.random() * options.length)]
            if(option) ws.send('select', option.value)

            // countdown question
            questionEl.textContent = state?.game?.data?.text

            // add question 
            questionsEl.innerHTML =  `
                ${options.map(option => `
                    <button class="btn-option style-retro" data-value="${option.value}">
                        ${option.text}
                    </button>
                `).join('')}
            `

            const buttons = questionsEl.querySelectorAll('.btn-option')
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (lastResponse === btn.dataset.value) return
                    buttons.forEach(b => b.classList.remove('selected'))
                    btn.classList.add('selected')
                    lastResponse = btn.dataset.value
                    ws.send('select', btn.dataset.value)
                })
            })

            modalQuizEl.classList.remove('hidden')

          } else {
            lastResponse = null
            modalQuizEl.classList.add('hidden')
          }

          // add other if not existent
          const leaderboard = state?.game?.leaderboard || {}
          Object.keys(leaderboard).forEach(name => {
            if(name === you.name) return
            if(!others.find(other => other.name === name)) {
              const other = new Player({ 
                name,
                y: -1,
                width: PLAYER_WIDTH,
                stairs,
                isYou: false
              })
              others.push(other)
              spawnEl.appendChild(other.el)
            }
          })
            
          others.forEach(other => other.setScore(state?.game?.leaderboard[other.name]))

          if(state?.game?.phase === PHASES.QUESTION) {
            questionCountdown.handle(data?.payload) 
          }


          //top
          const top = state?.game?.top || []
          // score: player1 <br> player2 <br> etc
          const pointsPlayers = top.reduce((acc, player) => {
            acc[player.score] = [...(acc[player.score] || []), player.name]
            return acc
          }, {})
          topXEl.innerHTML = `
            <h2>Top</h2>
            <hr style="margin: 10px 0; border-color: black;">
            ${Object.entries(pointsPlayers).reverse().map(([score, names]) => {
            return `
              <p>${score} pts</p>
              ${names.slice(0, 3).map(name => `<p> &nbsp; - ${name}</p>`).join('')} ${names.length > 3 ? `<p> &nbsp; - ${names.length - 3} others</p>` : ''}
              <br>
              <hr>
            `
          }).join('')}
          `
        },
        onclose: () => setTimeout(start, 5000),
        onerror: (error) => console.error(error)
      }
    )
  }


  // request animation frame for draw
  const update = () => {
    others?.forEach(other => other?.draw())
    you?.draw()
    questionCountdown.update()
    globalCountdown.update()
    requestAnimationFrame(update)
  }
  
  update()

  start()
}

setup()