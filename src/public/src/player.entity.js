export class Player {
    constructor({ name, width, stairs, y, isYou }){     
        this.name = name 
        this.stairs = stairs
        this.y = y
        this.width = width
        this.el = document.createElement('div')
        this.el.classList.toggle('other', !isYou)
        this.el.innerHTML = `
            ${isYou ? `
                <div class="you-marker">
                    <div class="you-label">YOU</div>
                    <div class="pointer-arrow"></div>
                </div>
                
                <div class="label">${name}</div>
            ` : ''}

            <div class="eyes">
                <div class="eye"></div>
                <div class="eye"></div>
            </div>
        `
        this.el.classList.add('actor')
    }

    setScore(score) {
        if(this.score === score) return
        this.score = score
        moveElement(this.el, this.stairs[score], 0, this.y)
    }

    moveTo(element) {
        moveElement(this.el, element, 0, this.y + 2)
    }

    handle({ me: { name, score }}) {
        this.setScore(score)
        this.name = name
        this.el.querySelector('.label').textContent = name
    }

    draw() {
        // La escala se maneja por CSS para que quepa en el escalón (stair)
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

