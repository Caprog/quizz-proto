import { CONTEXTS } from "../../shared/contants.shared.js"

export const HomeController = {
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

    handle(_context,type, _payload) {
        const handlers = {
            solo: CONTEXTS.GAME
        }

        return handlers[type]
    },

    exit() {}
}
