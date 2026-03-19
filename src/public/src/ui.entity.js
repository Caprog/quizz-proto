export class UILayer {
    constructor({ onStart }) {
        this.el = document.querySelector('.ui')
        this.onStart = onStart
        this.reset()
    }

    reset(){
        this.btnStart?.removeEventListener('click', this.onStart)

        this.el.innerHTML = `

        <div id="main-menu" class="main-menu">
            <h1 class="title">RETURN TO THE<br>SOURCE</h1>
            <button id="btn-start" class="style-retro" disabled>
                CONNECTING...
            </button>
        </div>
        ` 

        this.mainMenuEl = document.getElementById('main-menu')
        this.messageEl = document.getElementById('message')
        this.btnStart = document.getElementById('btn-start')
        this.btnStart.addEventListener('click', this.onStart)
        this.hideMessage()
    }

    handle({ game, me }){
        this.me = me
        
        switch(game?.phase) {
            case 'question':
                this.showQuiz(game?.data, game?.timer)
                break
            case 'feedback':
                this.showFeedback(game?.data)
                break
            case 'game_over':
                this.showGameOver()
                break
            default:
                this.hideQuiz()
                break
        }
    }

    showQuiz(data, timerConfig){
        if (this.currentPhase === 'question' && this.currentQuestion === data.text) {
            if (timerConfig && !this.timerConfig) {
                this.timerConfig = timerConfig
                this.localTimerEnd = Date.now() + timerConfig.remaining
            }
            return
        }

        this.currentPhase = 'question'
        this.currentQuestion = data.text
        this.timerConfig = timerConfig
        this.localTimerEnd = timerConfig ? Date.now() + timerConfig.remaining : null
        this.selectedAnswer = null

        this.el.innerHTML = `
        <div class="modal-quiz">
            <h1 class="title-quiz">${data.text}</h1>
            <div class="quiz-options">
                ${data.options.map(option => `
                    <button class="btn-option style-retro" data-value="${option.value}">
                        ${option.text}
                    </button>
                `).join('')}
            </div>
            <div class="timer-container">
                <div class="timer-bar" id="timer-bar"></div>
            </div>
        </div>
        ` 
        
        const buttons = this.el.querySelectorAll('.btn-option')
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.me?.confirmed) return
                
                this.selectedAnswer = btn.dataset.value
                buttons.forEach(b => b.classList.remove('selected'))
                btn.classList.add('selected')

                this.onSelect(this.selectedAnswer)
            })
        })
    }

    updateTimer() {
        const timerBar = document.getElementById('timer-bar')
        if (!timerBar || !this.localTimerEnd || !this.timerConfig) return
        
        const diff = this.localTimerEnd - Date.now()
        const percent = Math.max(0, (diff / this.timerConfig.duration) * 100)
        
        timerBar.style.width = `${percent}%`
    }

    showFeedback(data){
        if (this.currentPhase === 'feedback') return
        this.currentPhase = 'feedback'
        this.localTimerEnd = null
        this.timerConfig = null

        const isCorrect = this.me?.gainedPoints > 0
        if (!isCorrect) {
            this.el.querySelector('.modal-quiz')?.classList.add('shake')
        }

        this.el.innerHTML = `
        <div class="modal-quiz">
            <div class="feedback-modal">
                <div class="feedback-correct">
                    La réponse était : ${data.correctAnswer}
                </div>
                <div style="margin-top: 2cqw; font-size: 1cqw; color: var(--white);">
                    Points gagnés : ${this.me?.gainedPoints}
                </div>
            </div>
        </div>
        `
    }

    showGameOver() {
        if (this.currentPhase === 'game_over') return
        this.currentPhase = 'game_over'
        this.localTimerEnd = null
        this.timerConfig = null

        this.el.innerHTML = `
        <div class="modal-quiz">
            <h1 class="title-quiz">GAME OVER</h1>
            <div style="text-align: center; color: var(--white); font-size: 1.5cqw; margin-bottom: 2cqw;">
                Score final : ${this.me?.score}
            </div>
            <button id="btn-restart" class="style-retro" style="width: 100%">
                REJOUER
            </button>
        </div>
        `
        document.getElementById('btn-restart').addEventListener('click', () => {
            this.onRestart?.()
        })
    }

    hideQuiz() {
        if (this.currentPhase === 'none') return
        this.currentPhase = 'none'
        this.currentQuestion = null
        this.localTimerEnd = null
        this.timerConfig = null
    }

    onSelect(value) {
        this.send?.('select', value)
        this.send?.('confirm')
    }

    onRestart() {
        this.onRestart?.()
    }

    draw() {
        this.updateTimer()
    }

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