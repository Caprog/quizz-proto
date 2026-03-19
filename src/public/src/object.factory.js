export default (type, { name }) => {
    if(type === 'player') {
        const el = document.createElement('div')
        
        el.innerHTML = `
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

        el.classList.add('actor')

        return el
    }
}