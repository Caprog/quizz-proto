export const SimpleActionGuard = (actions = []) => async ({ session }, { type }) => {
  if(actions.includes(type)) return

  return {
    type: 'ACTION_NOT_ALLOWED',
    action: type,
    allowedActions: actions
  }
}


export const ActionGuard = (me) => async ({ session }, { type }) => {
  if(me?.actions?.[type]) return

  return {
    type: 'ACTION_NOT_ALLOWED',
    action: type,
    allowedActions: Object.keys(me?.actions || {})
  }
}