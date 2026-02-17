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

    handle({ goto }, type, payload) {
        const handlers = {
            solo: () => goto(CONTEXTS.GAME)
        }

        handlers[type]?.()
    },

    exit() {}
}
