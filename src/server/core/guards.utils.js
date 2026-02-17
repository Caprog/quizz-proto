export const runGuards = async (guards, ctx, type, payload, routeName) => {
  if (!guards) return true

  for (const guard of guards) {
    const success = await guard({ ctx, type, payload, routeName })
    if (!success) return false
  }

  return true
}