import { SCOPES } from "../../shared/contants.shared.js";

const ActionGuard = (playerId, action, controller) => {
  const actions = controller?.getActions?.(playerId) ?? {}
  const allowedActions = Object.keys(actions)
  return allowedActions.includes(action) ? null : {
    scope: SCOPES.PRIVATE,
    payload: {
      type: 'ACTION_NOT_ALLOWED',
      action: action,
      allowedActions
    }
  }
}

export const Guards = {
    ActionGuard
}
