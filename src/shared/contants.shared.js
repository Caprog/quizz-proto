const PORT = 3000
const WS_URL = `ws://localhost:${PORT}`

const SOCKET_EVENTS = {
    CONNECTION: 'connection',
    MESSAGE: 'message',
    CLOSE: 'close',
    LISTENING: 'listening',
    RELOAD: 'reload'
}

const SCOPES = {
    BROADCAST: 'broadcast',
    PRIVATE: 'private'
}

const CONTEXTS = {
    HOME: 'home',
    GAME: 'game',
    DISCONNECT: 'disconnect'
}

export { PORT, WS_URL, SCOPES, CONTEXTS, SOCKET_EVENTS }