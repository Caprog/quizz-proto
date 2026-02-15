import { SCOPES } from "../contants.shared.js"

const actions = {
  solo: { type: 'solo' },
  join: { type: 'join' },
  create: { type: 'create' }
}

const handlers = {
  solo: (playerId) => {
    return {
        context: 'game',
        scope: SCOPES.BROADCAST,
        recipients: [playerId]
    }
  }
}

export const HomeController = {

    enter(playerId) {
        return {
            scope: SCOPES.BROADCAST,
            recipients: [playerId]
        }
    },

    sync(_playerId) {
        return {
            me: {
                actions
            }
        }
    },

    handle(playerId, type, _payload) {
        const handler = handlers[type]
        if (!handler) return

        return handler(playerId)
    }
}
