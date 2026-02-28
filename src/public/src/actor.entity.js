import create from "./object.factory.js"

export class Actor {
    constructor(type, { x, y, enabled }){
        this.position = { x, y }
        this.el = create(type)
        this.enabled = enabled ?? true
    }

    getTransform() {
        return `translate3d(
            ${this.position.x}cqw, 
            ${this.position.y}cqw,
            0
        )`
    }

    draw(){
        this.el.style.visibility = this.enabled ? 'visible' : 'hidden'
        this.el.style.transform = this.getTransform()
    }
}