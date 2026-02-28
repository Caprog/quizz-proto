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
        this.el.appendChild(this.label.el)
        this.baseY = rest.y

        this.tickEl = document.createElement('span')
        this.tickEl.className = 'tick-simple'
        this.tickEl.textContent = '✔'
        this.tickEl.style.display = 'none'
        this.el.appendChild(this.tickEl)
    }

    showTick(visible) {
        this.tickEl.style.display = visible ? 'block' : 'none'
    }

    setScore(score = 0) {
        const actorWidth = 8 * (56.25 / 100) // matches cqminToCqw(8, 100, 56.25)
        const stepHeight = (actorWidth / 2)
        this.position.y = this.baseY - (score / 10) * stepHeight
    }

    draw() {
        super.draw()
        this.label.draw()
        this.marker?.draw?.()
    }
}