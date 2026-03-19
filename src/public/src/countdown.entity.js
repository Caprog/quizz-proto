export class Countdown {
    constructor(){
        this.el = document.getElementById('countdown_bar')
        this.lastEndCountDownTime = null
        this.startCountDownTime = null
        this.endCountDownTime = null
    }

    update(){
        const percentage = ((this.endCountDownTime - Date.now()) / (this.endCountDownTime - this.startCountDownTime)) * 100
        this.el.style.width = percentage + '%'
    }

    handle({ game }){
        if(this.lastEndCountDownTime !== game?.dateToNextState) {
            this.lastEndCountDownTime = game?.dateToNextState
            this.startCountDownTime = Date.now()
            this.endCountDownTime = new Date(game?.dateToNextState).getTime()
        }
    }
}