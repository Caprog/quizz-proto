import gameService from "./features/shared/game.service.js"

const onMessage = async (session, { type, payload }) => {
  gameService.findByPlayerId(session.id)
    ?.handle(session.id, { type, payload })
}

const onConnection = async (session) => {
  const game = await gameService.findAvailableGameOrReconnect({ 
    playerId: session.id,
    isBot: session.isBot,
    type: 'TRIVIA',
    emit: (args) => session.emit(args)
  })

  if(!game) {
    session.close()
  }
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
