export class StateMachine {
 
    constructor(states, initialState, context) {
        this.currentState = null
        this.states = states
        this.context = context
        this.transition(initialState)
    }

    dispatch(type, payload) {
       const state = this.states[this.currentState]
       if (!state?.handle) return null

       return state.handle(this.context, type, payload)
    }  
    
    transition(nextState) {
        if(!this.states) return
        
        const currentController = this.states[this.currentState]
        const nextController = this.states[nextState]

        if(!nextController) return

        if(currentController?.exit) currentController?.exit(this.context)
        
        this.currentState = nextState

        if(nextController?.enter) nextController?.enter(this.context)
    }
}