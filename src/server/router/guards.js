const ActionGuard = (actions) => ({ ctx, type, routeName }) => {
  if(!actions?.includes(type)) {
    ctx.emit('GUARD_REJECTED', { 
      context: routeName, 
      type: 'ACTION_NOT_ALLOWED',
      action: type,
      allowedActions: actions,
      error: 'Action not allowed' 
    })
    return false
  }
  return true
}

export const Guards = {
    ActionGuard
}
