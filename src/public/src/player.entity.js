export class Player {
    constructor({ name, width, stairs, y }){        
        this.stairs = stairs
        this.y = y
        this.width = width
        this.el = document.createElement('div')
        this.el.innerHTML = `
            <div class="you-marker">
                <div class="you-label">YOU</div>
                <div class="pointer-arrow"></div>
            </div>

            <div class="label">${name}</div>

            <div class="eyes">
                <div class="eye"></div>
                <div class="eye"></div>
            </div>
        `
        this.el.classList.add('actor')
    }

    handle({ me: { name, score }}) {
        if(this.score !== score) {
            this.score = score
            moveElement(this.el, this.stairs[score], 0, this.y)
        }
        this.el.querySelector('.label').textContent = name
    }

    draw() {
        this.el.style.width = this.width + 'cqw'
        this.el.style.transform = `translate(0cqw, ${this.y}cqw)`
    }
}


const moveElement = (el, newParent, originX, originY) => {
  const first = el.getBoundingClientRect()

  newParent.appendChild(el)

  const last = el.getBoundingClientRect()

  const invertX = first.left - last.left
  const invertY = first.top - last.top

  // bounce
  el.animate([
    { transform: `translate(${invertX}px, ${invertY}px)` },
    { transform: `translate(${originX}cqw, ${originY}cqw)` }
  ], {
    duration: 500,
    easing: 'ease-out'
  })
}