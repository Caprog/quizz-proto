import { Actor } from "./actor.entity.js"
import { Player } from "./player.entity.js"

const cqminToCqw = (value, width, height) => {
    if (width <= height) {
        return value
    }

    // When landscape, 1cqmin is 1cqh. 
    // We find how many cqw fit into one cqh.
    const ratio = height / width
    return value * ratio
}

const slots_count = 8
const staires = 12
const margin = 4
const actorWidth = cqminToCqw(8, 100, 56.25)
const x = ((100 - (margin * 2)) / 8) + 0.5
const y = 56.25 * 0.824

export class World {
    constructor(){
        this.el = document.querySelector('.world')
        this.reset()
    }
    
    reset(){
        this.objects = []
        this.slots = {}
        this.players = {}
        
        const world = this.el
        world.innerHTML = '<div class="floor"></div>'

        for (let i = 0; i < slots_count; i++) {
            const slotX = x * i + margin + actorWidth / 2
            this.slots[i] = { x: slotX, y, stairs: [] }

            for(let h = 0; h < staires; h++) {
                const stair = new Actor('stair', { 
                    x: slotX, 
                    y: y + (actorWidth * 1.5) - h * (actorWidth / 2),
                    enabled: false
                })
                this.objects.push(stair)
                this.slots[i].stairs.push(stair)
                world.appendChild(stair.el)
            }
        }
    }

    handle({ game, players, me }){
        const phaseChanged = this.lastPhase !== game?.phase
        this.lastPhase = game?.phase

        if(!this.players[me?.id]){
            this.players[me?.id] = new Player({ 
                x: this.slots[0].x, 
                y: this.slots[0].y, 
                isYou: true, 
                name: me?.name
            })
            this.players[me?.id].slotIndex = 0
            this.objects.push(this.players[me?.id])
            this.el.appendChild(this.players[me?.id].el)
        }

        // actorWidth is already defined in the upper scope of the file
        const stepHeight = actorWidth / 2

        const updateScores = () => {
            const updatePlayer = (player, data) => {
                if (!player || player.slotIndex === undefined) return
                player.setScore(data.score)
                player.showTick(game.phase === 'feedback' && data.gainedPoints > 0)

                const stepsReached = data.score
                this.slots[player.slotIndex].stairs.forEach((stair, i) => {
                    stair.enabled = i < stepsReached
                })
            }

            updatePlayer(this.players[me.id], me)
            Object.entries(players ?? {}).forEach(([id, p]) => {
                updatePlayer(this.players[id], p)
            })
        }

        // Delay climb if entering feedback phase
        if (game?.phase === 'feedback') {
            if (phaseChanged) {
                this.feedbackClimbScheduled = true
                setTimeout(() => {
                    updateScores()
                    this.feedbackClimbScheduled = false
                }, 1500)
            } else if (!this.feedbackClimbScheduled) {
                updateScores()
            }
        } else {
            this.feedbackClimbScheduled = false
            updateScores()
            if (phaseChanged) {
                // Hide ticks when leaving feedback
                this.players[me.id]?.showTick(false)
                Object.values(this.players).forEach(p => p.showTick(false))
            }
        }

        this.players[me.id].name = me.name
        let otherIdx = 1
        Object.entries(players ?? {}).forEach(([id, p]) => {
            if(id === me.id) return
            if(!this.players[id]) {
                const slotIndex = otherIdx++
                this.players[id] = new Player({ 
                    x: this.slots[slotIndex].x, 
                    y: this.slots[slotIndex].y,
                    isBot: p.isBot,
                    name: p.name
                })
                this.players[id].slotIndex = slotIndex
                this.objects.push(this.players[id])
                this.el.appendChild(this.players[id].el)
            } else {
                otherIdx++
            }
            this.players[id].name = p.name
        })
    }

    draw(){
        this.objects.forEach(o => o?.draw())
    }
}
