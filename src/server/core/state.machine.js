export class StateMachine {
  constructor(states) {
    if(!states) throw new Error('States are required')
    this.currentState = null
    this.states = states
  }

  async send(context, event) {
    const next = await this.states[this.currentState]?.handle(context, event)
    next && this.transition(context, next)
  }

  async transition(context, nextState) {
    if (!this.states[nextState]) return
    this.states[this.currentState]?.exit?.(context)
    this.currentState = nextState
    this.states[this.currentState]?.enter?.(context)
  }

  async view(context) {
    return this.states[this.currentState]?.view?.(context) || {}
  }
}