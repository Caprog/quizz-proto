const isNode = typeof process !== 'undefined' && process.versions && process.versions.node
const PORT = isNode ? (Number(process.env.PORT) || 4000) : 4000

let WS_URL = `ws://localhost:${PORT}`

if (typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    WS_URL = `${protocol}//${host}`
} else if (isNode) {
    if (process.env.WS_URL) {
        WS_URL = process.env.WS_URL
    } else if (process.env.RENDER_EXTERNAL_URL) {
        // Render provides RENDER_EXTERNAL_URL (e.g. https://app.onrender.com)
        WS_URL = process.env.RENDER_EXTERNAL_URL.replace(/^http/, 'ws')
    }
}

const SOCKET_EVENTS = {
    CONNECTION: 'connection',
    MESSAGE: 'message',
    CLOSE: 'close',
    LISTENING: 'listening',
    RELOAD: 'reload'
}

export { PORT, WS_URL, SOCKET_EVENTS }