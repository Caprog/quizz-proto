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

const slots_count = 12
const staires = 12
const margin = 20
const gameContainerHeight = 56.25
const actorWidth = cqminToCqw(8, 100, gameContainerHeight)
const x = ((100 - (margin * 2)) / 8) + 0.5
const actorY = gameContainerHeight - actorWidth - 0.44

export class World {
    constructor(){
        this.el = document.querySelector('.actors')
        this.reset()
    }
    
    reset(){
        this.slots = {}
        this.players = {}
        
        const world = this.el
        world.innerHTML = ''

        for (let i = 0; i < slots_count; i++) {
            const slotX = (x / 4) * i + margin + actorWidth / 2
            this.players[i] = new Player({
                x: slotX,
                y: actorY,
                isYou: i === 0,
                enabled: true
            })
            world.appendChild(this.players[i].el)
        }
    }

    handle({ game, players, me }){
        Object.entries(players).forEach(([id, p], idx) => {
            this.players[idx]?.handle({...p, isYou: id === me.id})
            this.players[idx].enabled = true
        })
    }

    draw(){
        Object.values(this.players).forEach(s => s.draw())
    }
}
