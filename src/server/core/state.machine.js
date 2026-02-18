const MAX_TRANSITION_DEPTH = 5

export class StateMachine {
  constructor(states, initialState) {
    this.currentState = null
    this.states = states
    this.transition(initialState)
  }

  dispatch(context, type, payload) {
    const state = this.states[this.currentState]
    if (!state?.handle) return null

    const next = state.handle(context, type, payload)

    if (next) this.transition(context, next)
  }

  transition(context, nextState, depth = 0) {
    if (depth > MAX_TRANSITION_DEPTH) {
      console.error(`Infinite transition loop detected. Last state: ${this.currentState} -> Next: ${nextState}`)
      return
    }

    if (!this.states) return

    const currentController = this.states[this.currentState]
    const nextController = this.states[nextState]

    if (!nextController) return

    if (currentController?.exit) currentController.exit(context)

    this.currentState = nextState

    if (nextController?.enter) {
      const recursiveNext = nextController.enter(context)
      if (recursiveNext) {
        this.transition(recursiveNext, depth + 1)
      }
    }
  }
}