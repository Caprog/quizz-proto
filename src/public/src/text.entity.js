import { Actor } from "./actor.entity.js"

export class Text extends Actor {
    
    constructor({ x, y, content, align, size }) {
        super('text', { x, y })
        this.el.textContent = content
        this.align = align ?? 'left'
        this.el.style.fontSize = `${size ?? 1.5}cqmin`
        this.el.classList.add('text')
    }

    getTransform() {
        let transform = super.getTransform()
        if (this.align === 'center') {
            transform += ' translateX(-50%)'
        }
        return transform
    }
}