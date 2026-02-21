import { CONTEXTS } from "../../../shared/contants.shared.js"
import { SimpleActionGuard } from "../guards/action.guard.js"

export default {
    guards: [SimpleActionGuard(['solo'])],
    enter() {},

    handle({ emit }, { type }) {
        const handlers = {
            solo: CONTEXTS.GAME
        }

        return handlers[type]
    },

    exit() {},

    view() {
        console.log('view home')
        return {
            context: CONTEXTS.HOME,
            me: {
                actions: {
                    solo: { type: 'solo' },
                    join: { type: 'join' },
                    create: { type: 'create' }
                }
            }
        }
    }
}
