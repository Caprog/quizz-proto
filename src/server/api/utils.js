
// get unique name [suffix].[phase].[suffix]
export const getNotRepeatName = (phases, suffixes, players) => {
    const random = () => Math.random() - 0.5
    const copy = structuredClone(phases).sort(random)
    const phase = copy.pop()
    const copySuffix = structuredClone(suffixes).sort(random)
    const suffix = copySuffix.pop()
    const otherSuffix = copySuffix.pop()
    const name = `${suffix}.${phase}.${otherSuffix}`
    if(Object.values(players).some(player => player.name === name)) {
        return getNotRepeatName(copy, suffixes, players)
    }
    return name
}