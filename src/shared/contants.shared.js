const PORT = 3000
const WS_URL = `ws://localhost:${PORT}`

const SOCKET_EVENTS = {
    CONNECTION: 'connection',
    MESSAGE: 'message',
    CLOSE: 'close',
    LISTENING: 'listening'
}

const SCOPES = {
    BROADCAST: 'broadcast',
    PRIVATE: 'private'
}

const CONTEXTS = {
    HOME: 'home',
    GAME: 'game'
}

export { PORT, WS_URL, SCOPES, CONTEXTS, SOCKET_EVENTS }