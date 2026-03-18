import { FLOW, PHASES } from "./types.js"

const { LOBBY } = PHASES

export class Trivia {

    state = LOBBY

    constructor(config, { emit }) {
        this.config = config
        this.players = {}
        this.sync = () => this.emit(emit)

        setInterval(() => {
            this.state = FLOW[FLOW.indexOf(this.state) + 1] ?? LOBBY
            this.sync()
        }, 10000)
    }

    emit(emit){
        console.log(this.players)
        Object.values(this.players)?.forEach(player => {
            emit?.({
                id: player.id, 
                type: 'sync', 
                payload: {
                    players_count: this.playersCount(),

                    game: {
                        phase: this.state,
                        
                        timer: this.timer ? {
                            duration: this.timer.duration,
                            remaining: this.timer.getRemaining(),
                        } : null,

                        top: Object.values(this.players)
                            .sort((a, b) => b.score - a.score)
                            .slice(0, 5)
                            .map(p => ({ 
                                name: p.name,
                                score: p.score ?? 0
                        })),
                    },

                    me: this.players[player.id]
                }
            })
        })
    }

    join(playerId) {
        if(this.players[playerId]) return

        this.players[playerId] = { 
            id: playerId,
            name: playerId, // getNotRepeatName(DAVID_MEKERSA_LEGACY_NAMES_AND_OTHER_STUFF, this.players) 
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