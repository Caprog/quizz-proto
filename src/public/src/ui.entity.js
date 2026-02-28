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

    handle({ game, me }){
        this.me = me
        
        switch(game?.phase) {
            case 'question':
                this.showQuiz(game?.data, game?.timeoutDate)
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

    showQuiz(data, timeoutDate){
        if (this.currentPhase === 'question' && this.currentQuestion === data.text) {
            this.updateTimer(timeoutDate)
            return
        }

        this.currentPhase = 'question'
        this.currentQuestion = data.text
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

        this.updateTimer(timeoutDate)
    }

    updateTimer(timeoutDate) {
        const timerBar = document.getElementById('timer-bar')
        if (!timerBar || !timeoutDate) return

        const diff = new Date(timeoutDate) - new Date()
        const totalDuration = 10000 // Assuming 10s for now, ideally passed from server or config
        const percent = Math.max(0, (diff / totalDuration) * 100)
        
        timerBar.style.width = `${percent}%`
    }

    showFeedback(data){
        if (this.currentPhase === 'feedback') return
        this.currentPhase = 'feedback'

        const isCorrect = this.me?.gainedPoints > 0
        if (!isCorrect) {
            this.el.querySelector('.modal-quiz')?.classList.add('shake')
        }

        this.el.innerHTML = `
        <div class="modal-quiz">
            <div class="feedback-modal">
                <div class="feedback-status" style="color: ${isCorrect ? '#fff' : '#ff5e5e'}">
                    ${isCorrect ? 'CORRECT !' : 'MAUVAIS !'}
                </div>
                <h1 class="title-quiz">${data.question}</h1>
                <div class="feedback-correct">
                    La réponse était : ${data.correctAnswer}
                </div>
                <div style="margin-top: 2cqw; font-size: 1cqw; color: #fff;">
                    Points gagnés : ${this.me?.gainedPoints}
                </div>
            </div>
        </div>
        `
    }

    showGameOver() {
        if (this.currentPhase === 'game_over') return
        this.currentPhase = 'game_over'

        this.el.innerHTML = `
        <div class="modal-quiz">
            <h1 class="title-quiz">GAME OVER</h1>
            <div style="text-align: center; color: #fff; font-size: 1.5cqw; margin-bottom: 2cqw;">
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
        // If we are in lobby or game_start, we might want to keep the main menu or message
        // but the 'handle' call from client.js also triggers world.handle
    }

    onSelect(value) {
        this.send?.('select', value)
        // Auto confirm for now to match the user's reference feel (one click selection)
        // or we could add a confirm button if needed. The reference had one-click solve?
        // Wait, the reference code has: b.onclick = () => solve(i, data.c)
        // It calls solve immediately. So I'll send both select and confirm if needed, 
        // but the server handles 'confirm' separately.
        // Let's just send 'select' for now and see. 
        // Actually, the server's handleQuestion expects 'select' then 'confirm'.
        this.send?.('confirm')
    }

    onRestart() {
        // For restart, we might need a specific message or just reload
        window.location.reload()
    }

    draw() {
        // If we want the timer to update every frame without waiting for server sync
        // we would need to store the timeoutDate and update it here.
        // But for now, we rely on server sync which seems frequent enough.
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