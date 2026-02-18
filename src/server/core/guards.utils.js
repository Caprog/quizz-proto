export const runGuards = async (guards = [], params) => {
  for (const guard of guards) {
    if (!await guard(params)) return false
  }
  return true
}