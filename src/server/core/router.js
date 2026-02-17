import { StateMachine } from "./state.machine.js"
import { runGuards } from "./guards.utils.js"

export const RouterFactory = (routes, context) => {
    const flatByProp = (routes, prop) => Object.entries(routes).reduce((acc, [key, route]) => ({ ...acc, [key]: route?.[prop] }), {})
    const guards = flatByProp(routes, 'guards')
    const controllers = flatByProp(routes, 'controller')
    const defaultRoute = Object.entries(routes).find(([_, route]) => route?.default)?.[0]
    const disconnectRoute = Object.entries(routes).find(([_, route]) => route?.disconnect)?.[0]

    if (!defaultRoute) throw new Error('Default route is required= use default: true in a route')
    if (!disconnectRoute) throw new Error('Disconnect route is required= use disconnect: true in a route')
    
    const machine = new StateMachine(controllers, defaultRoute, context)
    
    machine.transition(defaultRoute)

    return {
        handle: (type, payload) => {
            if(runGuards(guards[machine.currentState], context, type, payload, machine.currentState)) {
                machine.dispatch(type, payload)
            }
        },
        disconnect: () => {
            machine.transition(disconnectRoute)
        }
    }   
}