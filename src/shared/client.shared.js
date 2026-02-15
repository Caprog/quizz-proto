export const WebSocketRouter = (onSync, onError) => {
  return {
    onmessage({ type, payload }) {
      type === 'sync' && onSync?.(payload)
      type === 'GUARD_REJECTED' && onError?.(payload)
    }
  }
}