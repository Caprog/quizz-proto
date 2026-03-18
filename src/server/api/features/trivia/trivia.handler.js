export const enterGameStart = (game) => {
    game.data = {
        currentQuestionIndex: -1,
        questions: QuestionService.getRandomQuestions(game.config.totalQuestions)
    }
}


export const enterQuestion = (game) => {
        if(game.data.currentQuestionIndex === -1 || 
            game.data.currentQuestionIndex + 1 === game.config.totalQuestions) {
            game.data.questions = QuestionService.getRandomQuestions(game.config.totalQuestions)
        }
    
        this.data.currentQuestionIndex++
        this.data.currentQuestion = this.data.questions[this.data.currentQuestionIndex]
        this.data.correctAnswer = this.data.currentQuestion?.options?.find(option => option.isCorrect)?.value
    
        Object.values(this.players).forEach(player => {
            player.selectedAnswer = null
            player.confirmed = false
        })
    }

export const handleQuestion = (game, playerId, { type, payload }) => {
        const player = game.players[playerId]
        if(!player) return

        if(type === 'select' && 
            game.data.currentQuestion
                ?.options
                ?.find(option => option.value === payload)){
            player.selectedAnswer = payload
            this.sync?.()
        }

        if(type === 'confirm' && player.selectedAnswer){
            player.confirmed = true
            this.sync?.()
        }

        if(Object.values(this.players).every(player => player.confirmed)) {
            this.transit()
        }
    }

export const enterFeedback = (game) => {
        Object.values(game.players).forEach(player => {
            player.gainedPoints = player?.selectedAnswer === game.data?.correctAnswer ? 1 : 0
            player.score += player.gainedPoints
        })
    }

    
export const handleFeedback = (game, playerId, { type, payload }) => {
        const player = game.players[playerId]
        if(!player) return

        if(type === 'next'){
            game.transit()
        }
    }


    
export const viewQuestionData = (game) => {
        return {
            text: game.data.currentQuestion?.question,
            options: game.data.currentQuestion?.options?.map(option => ({
                text: option.text,
                value: option.value
            }))
        }
    }

export const viewFeedbackData = (game) => {
        return {
            question: game.data.currentQuestion?.question,
            correctAnswer: game.data.currentQuestion?.options?.find(option => option.isCorrect)?.text,
        }
    }

export const enterGameOver = (game) => {
        game.state = GAME_OVER
        game.timer?.stop()
    }


export const transit = (game) => {
        const questionPhase = { 
            guard: () => game.data.currentQuestionIndex + 1 < game.config.totalQuestions,
            target: QUESTION, 
            timeout: game.config.confirmationTimer,
            enter: enterQuestion,
            handler: this.handleQuestion,
            view: this.viewQuestionData
        }

        const nextPhase = {
            [QUESTION]: { 
                target: FEEDBACK, 
                timeout: this.config.feedbackTimer,
                enter: this.enterFeedback,
                handler: this.handleFeedback,
                view: this.viewFeedbackData
            },
            [FEEDBACK]: [
                questionPhase,
                {
                    target: GAME_OVER,
                    enter: this.enterGameOver,
                    handler: this.handleGameOver,
                    view: this.viewGameOverData
                }
            ]
        }
        const handler = nextPhase[this.state]
        const phase = Array.isArray(handler)
            ? handler?.find?.(phase => phase?.guard?.()) ?? handler[handler.length - 1]
            : handler
        
        if(phase) {
            this.timer?.stop()
            this.state = phase.target
            const shouldTransit = phase.enter?.bind(this)?.()
            this.handle = phase.handler?.bind(this) ?? (() => {})
            this.view = phase.view?.bind(this) ?? (() => {})

            if(shouldTransit) {
                this.transit()
                return
            }

            if(phase.timeout) {
                this.timer = timerService.startAndGet(
                    this.config.room_code, 
                    phase.timeout,
                    () => this.transit()
                )
            } else {
                this.timer = null
            }

            this.sync?.()
        }
    }