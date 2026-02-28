const isNode = typeof process !== 'undefined' && process.versions && process.versions.node
const PORT = isNode ? (process.env.PORT || 3000) : 3000

let WS_URL = `ws://localhost:${PORT}`

if (typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    WS_URL = `${protocol}//${host}`
} else if (isNode && process.env.WS_URL) {
    WS_URL = process.env.WS_URL
}

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