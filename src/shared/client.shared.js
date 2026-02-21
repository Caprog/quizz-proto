export const WebSocketRouter = (onSync, onError) => {
  return {
    onmessage({ type, payload }) {
      type === 'sync' && onSync?.(payload)
      type === 'error' && onError?.(payload)
    }
  }
}