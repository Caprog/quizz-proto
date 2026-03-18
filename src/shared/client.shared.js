export const WebSocketRouter = (onSync, onError, onDisconnect) => {
  return {
    onmessage({ type, payload }) {
      type === 'sync' && onSync?.(payload)
      type === 'error' && onError?.(payload)
    },
    onclose() {
      onDisconnect?.()
    },
    onerror(error) {
      onError?.(error)
    }
  }
}