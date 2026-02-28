export default (type) => {
    if(type === 'player') {
        const el = document.createElement('div')
        
        el.innerHTML = `
            <div class="eyes">
                <div class="eye"></div>
                <div class="eye"></div>
            </div>
        `

        el.classList.add('actor')

        return el
    }

    if(type === 'stair') {
        const el = document.createElement('div')
        el.classList.add('stair')
        return el
    }

    if(type === 'text'){
        const el = document.createElement('p')
        return el
    }

    if(type === 'marker'){
        const el = document.createElement('div')
        el.className = 'you-marker'
        el.innerHTML = `<div class="you-label">YOU</div><div class="pointer-arrow"></div>`
        return el
    }

    if(type === 'bot-marker'){
        const el = document.createElement('div')
        el.className = 'bot-marker'
        el.innerHTML = `<div class="bot-label">BOT</div><div class="pointer-arrow"></div>`
        return el
    }
}