import { Actor } from "./actor.entity.js"
import { Text } from "./text.entity.js"

export class Player extends Actor {
    constructor({ name, isYou, isBot, ...rest }){
        super('player', { ...rest })
        this.marker = isYou 
            ? new Actor('marker', { x: 2.25, y: 0 }) 
            : isBot 
                ? new Actor('bot-marker', { x: 2.25, y: 0 }) 
                : null
        this.marker?.draw()
        this.marker && this.el.appendChild(this.marker.el)
        this.label = new Text({ x: 2.25, y: -6, content: name, align: 'center' })
        this.label.draw()
        this.el.appendChild(this.label.el)
    }

    draw() {
        super.draw()
        this.label.draw()
        this.marker?.draw?.()
    }
}