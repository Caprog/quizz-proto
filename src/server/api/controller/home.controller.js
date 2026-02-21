import { CONTEXTS } from "../../../shared/contants.shared.js"

export default {
    enter({ emit }) {
        emit('sync', {
            context: CONTEXTS.HOME,
            me: {
                actions: {
                    solo: { type: 'solo' },
                    join: { type: 'join' },
                    create: { type: 'create' }
                }
            }
        })
    },

    handle({ emit }, { type }) {
        const handlers = {
            solo: CONTEXTS.GAME
        }

        return handlers[type]
    },

    exit() {}
}
