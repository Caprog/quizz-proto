import create from "./object.factory.js"

export class Actor {
    constructor(el, { x, y, width, enabled }){
        this.el = el
        this.position = { x, y }
        this.width = width
        this.enabled = enabled ?? true
    }

    draw(){
        this.el.style.visibility = this.enabled ? 'visible' : 'hidden'
        this.el.style.opacity = this.enabled ? '1' : '0'
        this.el.style.width = this.width + 'cqw'
    }
}