export const WebSocketService = {
    send: (ws, type, payload) => {
        ws?.send?.(JSON.stringify({ type, payload }))
    }
}