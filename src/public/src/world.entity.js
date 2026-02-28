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
            for(let h = 0; h < staires; h++) {
                const stair = new Actor('stair',
                    { 
                        x: x * i + margin + actorWidth / 2, 
                        y: y + (actorWidth / 1.2) - h * (actorWidth / 2),
                        enabled: false
                    })
        
                this.objects.push(stair)
                world.appendChild(stair.el)
            }
        
            this.slots[i] = {
                x: x * i + margin + actorWidth / 2, 
                y
            }
        }
    }

    handle({ players, me }){
        if(!this.players[me?.id]){
            this.players[me?.id] = new Player({ 
                x: this.slots[0].x, 
                y: this.slots[0].y, 
                isYou: true, 
                name: me?.name
            })
            this.objects.push(this.players[me?.id])
            this.el.appendChild(this.players[me?.id].el)
        }

        Object.entries(players ?? {})?.forEach(([id, p], idx) => {
            if(id === me?.id) return

            if(!this.players[id]) {
                this.players[id] = new Player({ 
                    x: this.slots[idx].x, 
                    y: this.slots[idx].y,
                    isBot: p?.isBot,
                    name: p?.name
                })
                this.objects.push(this.players[id])
                this.el.appendChild(this.players[id].el)
            }
        })
    }

    draw(){
        this.objects.forEach(o => o?.draw())
    }
}
