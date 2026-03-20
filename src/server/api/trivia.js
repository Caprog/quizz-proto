import { enter_feedback, enter_game_start, enter_question, enter_score, handle_question, view_question_data } from "./trivia.handler.js"
import { DAVID_MEKERSA_LEGACY_NAMES_AND_OTHER_STUFF, FLOW, PHASES, SUFFIXES } from "../../shared/trivia.types.js"
import { getNotRepeatName } from "./utils.js"

const { LOBBY, GAME_START, QUESTION, FEEDBACK, SCORE, GAME_OVER, PREPARE_TO_QUESTION } = PHASES

const speed = 1

const timers = {
    [LOBBY]: 2000 * speed,
    [GAME_START]: 5000 * speed,
    [PREPARE_TO_QUESTION]: 2000 * speed,
    [QUESTION]: 20000 * speed,
    [FEEDBACK]: 1000 * speed,
    [SCORE]: 3000 * speed,
    [GAME_OVER]: 8000 * speed
}

const guards = {
    [PREPARE_TO_QUESTION]: (game) => game.state === SCORE 
        && game.data.questionIndex + 1 < game.config.questionsCount,

    [GAME_OVER]: (game) => game.state === SCORE
        && game.data.questionIndex + 1 === game.config.questionsCount
}

const enters = {
    [GAME_START]: enter_game_start,
    [QUESTION]: enter_question,
    [FEEDBACK]: enter_feedback,
    [SCORE]: enter_score
}

const handlers = {
    [QUESTION]: handle_question
}

const views = {
    [QUESTION]: view_question_data
}


export class Trivia {

    state = LOBBY
    timeToNextState = 0

    constructor(config, { emit }) {
        this.config = config
        this.players = {}
        this.data = {}
        this.sync = () => this.emit(emit)
        let last_state = null
        const checkState = () => {
            this.state = Object.entries(guards).find(([key, fn]) => fn(this))?.[0] 
                ?? FLOW[FLOW.indexOf(this.state) + 1] 
                ?? LOBBY

            if(this.state !== last_state) {
                this.timeToNextState = timers[this.state] ?? 1000
                this.dateToNextState = new Date(Date.now() + this.timeToNextState).toISOString()
                last_state = this.state
                enters[this.state]?.(this)
                this.sync()
            }


            setTimeout(() => checkState(), this.timeToNextState)
        }

        checkState()
    }

    getState() {
        const players = Object.values(this.players)
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

        const uniqueScores = [...new Set(players.map(p => p.score ?? 0))].slice(0, 3)
        const minThreshold = uniqueScores[uniqueScores.length - 1] ?? 0

        const top = players
        .filter(p => p.score > 0)
        .filter(p => (p.score ?? 0) >= minThreshold)
        .map(({ name, score }) => ({
            name,
            score: score ?? 0
        }))
        return {
            players_count: this.playersCount(),

            game: {
                phase: this.state,
                
                questionNumber: this.data.questionIndex + 1,
                questionsCount: this.config.questionsCount,

                dateToNextState: this.dateToNextState,

                top,

                leaderboard: Object.values(this.players)
                    .reduce((acc, player) => {
                        acc[player.name] = player.score
                        return acc
                    }, {}),

                data: views[this.state]?.(this)
            }
        }
    }

    emit(emit){
        Object.values(this.players)?.forEach(player => {
            emit?.({
                id: player.id, 
                type: 'sync', 
                payload: {
                    ...this.getState(),
                    me: this.players[player.id]
                }
            })
        })
    }

    handle(playerId, { type, payload }) {
        handlers[this.state]?.(this, playerId, { type, payload })
    }

    join(playerId) {
        if(this.players[playerId]) return

        this.players[playerId] = { 
            id: playerId,
            name: getNotRepeatName(DAVID_MEKERSA_LEGACY_NAMES_AND_OTHER_STUFF, SUFFIXES, this.players), 
            score: 0
        }

        this.sync()
    }

    leave(playerId) {
        if(!this.players[playerId]) return

        delete this.players[playerId]

        this.sync()
    }

    playersCount() {
        return Object.keys(this.players).length
    }
}