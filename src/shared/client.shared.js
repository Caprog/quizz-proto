import { SOCKET_EVENTS } from './contants.shared.js'

export const WebSocketRouter = (onSync, onError, onDisconnect, onReload) => {
  return {
    onmessage({ type, payload }) {
      type === 'sync' && onSync?.(payload)
      type === 'error' && onError?.(payload)
      type === SOCKET_EVENTS.RELOAD && (onReload ? onReload() : location.reload())
    },
    onclose() {
      onDisconnect?.()
    },
    onerror(error) {
      onError?.(error)
    }
  }
}