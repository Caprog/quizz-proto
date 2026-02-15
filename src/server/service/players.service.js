const players = new Map()

const addPlayer = (id, state) => {
  players.set(id, state)
}

const removePlayer = (id) => {
  players.delete(id)
}

const getPlayer = (id) => {
  return players.get(id)
}

const updatePlayer = (id, state) => {
  players.set(id, state)
}

export const PlayersService = { 
  addPlayer,
  removePlayer,
  getPlayer,
  updatePlayer
}