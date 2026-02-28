export class UILayer {
    constructor({ onStart }) {
        this.el = document.querySelector('.ui')
        this.onStart = onStart
        this.reset()
    }

    reset(){
        this.btnStart?.removeEventListener('click', this.onStart)

        this.el.innerHTML = `
        <p id="message" class="style-retro"></p>

        <div id="main-menu" class="main-menu">
            <h1 class="title">RETURN TO THE<br>SOURCE</h1>
            <button id="btn-start" class="style-retro">
                COMMENCER
            </button>
        </div>
        ` 

        this.mainMenuEl = document.getElementById('main-menu')
        this.messageEl = document.getElementById('message')
        this.btnStart = document.getElementById('btn-start')
        this.btnStart.addEventListener('click', this.onStart)
        this.hideMessage()
    }

    handle({ game }){
        if(game?.phase === 'question'){
            debugger
            this.showQuiz(game?.data)
        }
    }

    showQuiz(data){
        this.el.innerHTML = `
        <div class="modal-quiz">
            <h1 class="title-quiz">${data.text}</h1>
            <div class="quiz-options">
                ${data.options.map(option => `
                    <button data-value="${option.value}" class="btn-option style-retro">
                        ${option.text}
                    </button>
                `).join('')}
            </div>
        </div>
        ` 
        this.btnOptions = document.querySelectorAll('#btn-option')
        this.btnOptions.forEach(btn => {
            btn.addEventListener('click', () => {
                this.onSelect(btn.id)
            })
        })
    }

    draw() {}

    handleError(error) {
        console.error(error)
    }

    hideMainMenu() {
        this.mainMenuEl.style.display = 'none'
    }

    showMainMenu() {
        this.mainMenuEl.style.display = 'flex'
    }

    hideMessage() {
        this.messageEl.style.display = 'none'
    }

    showMessage(message) {
        this.messageEl.textContent = message
        this.messageEl.style.display = 'block'
    }

    setEnabled(enabled) {
        this.el.style.display = enabled ? 'block' : 'none'
    }
}