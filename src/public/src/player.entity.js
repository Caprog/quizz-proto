import { Actor } from "./actor.entity.js"
import { Text } from "./text.entity.js"

export class Player extends Actor {
    constructor({ name, isYou, isBot, ...rest }){
        super('player', { ...rest })
        this.botLabel = new Actor('bot-marker', { x: 2.25, y: 0, enabled: false }) 
        this.youLabel = new Actor('marker', { x: 2.25, y: 0, enabled: false }) 
        this.el.appendChild(this.botLabel.el)
        this.el.appendChild(this.youLabel.el)
       
        this.label = new Text({ x: 2.25, y: -6, content: name, align: 'center' })
        this.el.appendChild(this.label.el)
        this.baseY = rest.y

        this.tickEl = document.createElement('span')
        this.tickEl.className = 'tick-simple'
        this.tickEl.textContent = '✔'
        this.tickEl.style.display = 'none'
        this.el.appendChild(this.tickEl)
    }

    handle({ score, isCorrect, isBot, isYou, name }){
        const offset = score > 0 ? 0 : 0
        this.label.el.textContent = name
        this.botLabel.enabled = isBot
        this.youLabel.enabled = isYou
        this.position.y = this.baseY - (4.13 * score)
        this.tickEl.style.display = isCorrect ? 'block' : 'none'
    }

    draw() {
        super.draw()
        this.label.draw()
        this.botLabel.draw()
        this.youLabel.draw()
    }
}