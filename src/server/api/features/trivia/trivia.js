import { DAVID_MEKERSA_LEGACY_NAMES_AND_OTHER_STUFF, EMOJIS, MEKERSA_HATE_LIST, PHASES } from "./types.js";
import timerService from "../../shared/timer.service.js";
import { QuestionService } from "./question.service.js";

const { LOBBY, GAME_START, QUESTION, FEEDBACK, GAME_OVER } = PHASES

export class Trivia {

    state = LOBBY

    constructor(config, { emit }) {
        this.config = config
        this.data = {}
        this.players = {}
        this.sync = () => this.emit(emit)
    }

    emit(emit){
        const gameData =  this.getGameData()
        Object.values(this.players)?.forEach(player => {
            emit?.({
                id: player.id, 
                type: 'sync', 
                payload: {
                    ...gameData,
                    me: this.getPlayerData(player.id)
                }
            })
        })
    }

    disconnect(playerId) {
        if(!this.players[playerId]) return
        this.players[playerId].connected = false
        this.sync?.()
    }

    join(playerId, isBot) {
        console.log('is a bot', isBot)
        if(this.playersCount() === 0 && isBot) return
        if(!this.players[playerId] && this.state !== LOBBY) return
        if(this.playersCount() >= this.config.maxPlayers) return
        if(this.players[playerId]?.connected) return

        this.players[playerId] = { 
            id: playerId, 
            connected: true, 
            isBot,
            name: isBot 
                ? this.getNotRepeatName(MEKERSA_HATE_LIST)
                : this.getNotRepeatName(DAVID_MEKERSA_LEGACY_NAMES_AND_OTHER_STUFF) 
         }

        if(!this.timer && this.playersCount() >= this.config.maxPlayers) {
            this.timer = timerService.startAndGet(
                this.config.room_code, 
                this.config.matchmakingTimer, 
                () => {
                    this.transit()
                }
            )
        }

        if(this.playersCount() >= this.config.maxPlayers && 
            !Object.values(this.players).every(player => player.isBot)) {
            this.timer.stop()
            this.transit()
        }

        this.sync()
    }

    getNotRepeatName(names){
        const random = () => Math.random() - 0.5
        const copy = structuredClone(names).sort(random)
        const name = copy.pop()
        if(Object.values(this.players).some(player => player.name === name)) {
            return this.getNotRepeatName(copy)
        }
        return name
    }

    enterGameStart() {
        this.data = {
            currentQuestionIndex: -1,
            questions: QuestionService.getRandomQuestions(this.config.totalQuestions)
        }
    }

    canJoin(playerId) {
        return this.players[playerId] || (this.playersCount() < this.config.maxPlayers && this.state === LOBBY)
    }

    getPlayerData(playerId){
        return {
            ...this.players[playerId]
        }
    }

    getGameData(){
        return {

            room: {
                room_code: this.config.room_code,
                maxPlayers: this.config.maxPlayers,
                playersCount: this.playersCount()
            },
            
            players: Object.values(this.players)
                .reduce((acc, p) => ({ 
                    ...acc, 
                    [p.id]: { 
                        connected: p.connected, 
                        confirmed: p.confirmed, 
                        isBot: p.isBot,
                        name: p.name
                     } }), {}),

            game: {
              type: 'TRIVIA',
              phase: this.state,
              timeoutDate: this.timer?.timeoutDate,
              data: this.view?.(),
            },
        }
    }

    enterQuestion() {
        if(this.data.currentQuestionIndex === -1 || 
            this.data.currentQuestionIndex + 1 === this.config.totalQuestions) {
            this.data.questions = QuestionService.getRandomQuestions(this.config.totalQuestions)
        }
    
        this.data.currentQuestionIndex++
        this.data.currentQuestion = this.data.questions[this.data.currentQuestionIndex]
        this.data.correctAnswer = this.data.currentQuestion?.options?.find(option => option.isCorrect)?.value
    
        Object.values(this.players).forEach(player => {
            player.selectedAnswer = null
            player.confirmed = false
            player.score = 0
        })
    }

    handleQuestion(playerId, { type, payload }) {
        const player = this.players[playerId]
        if(!player) return

        if(type === 'select' && 
            this.data.currentQuestion
                ?.options
                ?.find(option => option.value === payload)){
            player.selectedAnswer = payload
            this.sync?.()
        }

        if(type === 'confirm' && player.selectedAnswer){
            player.confirmed = true
            this.sync?.()
        }

        if(Object.values(this.players).every(player => player.confirmed)) {
            this.transit()
        }
    }

    enterFeedback() {
        Object.values(this.players).forEach(player => {
            player.gainedPoints = player?.selectedAnswer === this.data?.correctAnswer ? 10 : 0
            player.score += player.gainedPoints
        })
    }

    transit(){
        const questionPhase = { 
            guard: () => this.data.currentQuestionIndex + 1 < this.config.totalQuestions,
            target: QUESTION, 
            timeout: this.config.confirmationTimer,
            enter: this.enterQuestion,
            handler: this.handleQuestion,
            view: this.viewQuestionData
        }

        const nextPhase = {
            [LOBBY]: { 
                target: GAME_START, 
                timeout: this.config.gameStartTimer,
                enter: this.enterGameStart,
            },
            [GAME_START]: questionPhase,
            [QUESTION]: { 
                target: FEEDBACK, 
                timeout: this.config.feedbackTimer,
                enter: this.enterFeedback,
                handler: this.handleFeedback,
                view: this.viewFeedbackData
            },
            [FEEDBACK]: [
                questionPhase,
                {
                    target: GAME_OVER,
                    enter: this.enterGameOver,
                    handler: this.handleGameOver,
                    view: this.viewGameOverData
                }
            ]
        }
        const handler = nextPhase[this.state]
        const phase = Array.isArray(handler)
            ? handler?.find?.(phase => phase?.guard?.()) ?? handler[handler.length - 1]
            : handler
        
        if(phase) {
            this.timer?.stop()
            this.state = phase.target
            const shouldTransit = phase.enter?.bind(this)?.()
            this.handle = phase.handler?.bind(this) ?? (() => {})
            this.view = phase.view?.bind(this) ?? (() => {})

            if(shouldTransit) {
                this.transit()
                return
            }

            if(phase.timeout) {
                this.timer = timerService.startAndGet(
                    this.config.room_code, 
                    phase.timeout,
                    () => this.transit()
                )
            } else {
                this.timer = null
            }

            this.sync?.()
        }
    }

    handleFeedback(playerId, { type, payload }) {
        const player = this.players[playerId]
        if(!player) return

        if(type === 'next'){
            this.transit()
        }
    }

    playersCount() {
        return Object.keys(this.players).length
    }

    viewQuestionData(){
        return {
            text: this.data.currentQuestion?.question,
            options: this.data.currentQuestion?.options?.map(option => ({
                text: option.text,
                value: option.value
            }))
        }
    }

    viewFeedbackData(){
        return {
            question: this.data.currentQuestion?.question,
            correctAnswer: this.data.currentQuestion?.options?.find(option => option.isCorrect)?.text,
        }
    }

    enterGameOver() {
        this.state = GAME_OVER
        this.timer?.stop()
    }
}