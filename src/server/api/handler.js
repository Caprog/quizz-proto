import gameService from "./features/shared/game.service.js"

const onMessage = async (session, { type, payload }) => {
  gameService.findByPlayerId(session.id)
    ?.handle(session.id, { type, payload })
}

const onConnection = async (session) => {
  gameService.findAvailableGameOrReconnect({ 
    playerId: session.id,
    type: 'TRIVIA',
    emit: (args) => session.emit(args)
  })
}

const onDisconnect = (session) => {
  gameService.findByPlayerId(session.id)
    ?.disconnect(session.id)
}

export {
  onConnection,
  onMessage,
  onDisconnect
}
