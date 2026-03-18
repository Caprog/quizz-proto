export const getNotRepeatName = (names, players) => {
    const random = () => Math.random() - 0.5
    const copy = structuredClone(names).sort(random)
    const name = copy.pop()
    if(Object.values(players).some(player => player.name === name)) {
        return getNotRepeatName(copy, players)
    }
    return name
}