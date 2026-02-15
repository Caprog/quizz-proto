import { SCOPES } from "../../contants.shared.js"

const actions = {
  solo: { type: 'solo' },
  join: { type: 'join' },
  create: { type: 'create' }
}

const handlers = {
  solo: () => {
    return {
        context: 'game',
        scope: SCOPES.PRIVATE
    }
  }
}

export const HomeController = {

    enter() {
        return {
            scope: SCOPES.PRIVATE
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
        return handlers[type]?.(playerId)
    }
}
