export const runGuards = async (guards = [], params) => {
  for (const guard of guards) {
    const result = await guard(params)
    if (result) return result
  }
  return false
}