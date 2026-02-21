export const SimpleActionGuard = (actions = []) => async ({ session, type, payload }) => {
  if(actions.includes(type)) return

  return {
    type: 'ACTION_NOT_ALLOWED',
    action: type,
    allowedActions: actions
  }
}