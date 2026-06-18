/**
 * Небольшая обертка над EventSource.
 *
 * @author Боженька <god@heaven>
 * @version 2.0.0
 */
import { onUnmounted } from 'vue'

const defaultOptions = {
  baseURL: false,
  withCredentials: true,
  maxReconnectAttempts: 3,
  reconnectDelay: 1000
}

export function useSSE(url, options = {}) {
  const opts = { ...defaultOptions, ...options }
  const resolvedURL = url ?? opts.baseURL

  let connection = null
  let isConnected = false
  let isReconnecting = false
  let shouldReconnect = true
  let reconnectTimer = null
  let reconnectAttempts = 0

  const handlers = new Map()

  let _onVisibilityChange = null
  let _onOnline = null

  function connect() {
    if (connection) return

    connection = new EventSource(resolvedURL, {
      withCredentials: opts.withCredentials
    })

    connection.onopen = handleConnect
    connection.onerror = handleError

    for (const [type, { handler }] of handlers) {
      connection.addEventListener(type, handler)
    }

    return connection
  }

  function handleConnect() {
    isConnected = true
    isReconnecting = false
    reconnectAttempts = 0
  }

  function handleError(e) {
    isConnected = false

    if (!shouldReconnect || reconnectAttempts >= opts.maxReconnectAttempts) {
      console.warn('[SSE] Max reconnect attempts reached, closing connection...')
      close()
      return
    }

    if (isReconnecting) return
    isReconnecting = true
    reconnectAttempts++

    const delay = Math.min(
      opts.reconnectDelay * Math.pow(2, reconnectAttempts - 1),
      30000
    )

    reconnectTimer = setTimeout(() => {
      cleanup()
      connect()
    }, delay)
  }

  function cleanup() {
    isReconnecting = false

    if (connection) {
      connection.close()
      connection = null
    }

    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }

  function close() {
    shouldReconnect = false
    cleanup()
    handlers.clear()

    if (_onVisibilityChange) {
      document.removeEventListener('visibilitychange', _onVisibilityChange)
    }
    if (_onOnline) {
      window.removeEventListener('online', _onOnline)
    }
  }

  function on(type, callback) {
    if (handlers.has(type)) {
      return console.error('[SSE] A handler with this type already exists.')
    }

    const handler = (event) => {
      try {
        const data = JSON.parse(event.data)
        callback(data)
      } catch (err) {
        console.error('[SSE] Failed to parse JSON', err)
      }
    }

    handlers.set(type, { callback, handler })

    if (connection) {
      connection.addEventListener(type, handler)
    } else {
      console.warn('[SSE] on() called before connection — handler queued, will attach on connect()')
    }
  }

  function off(type) {
    const entry = handlers.get(type)
    if (!entry) return

    if (connection) {
      connection.removeEventListener(type, entry.handler)
    }

    handlers.delete(type)
  }

  // Биндим lifecycle события
  _onVisibilityChange = () => {
    if (document.visibilityState === 'visible' && !isConnected && !connection) {
      _forceReconnect()
    }
  }
  
  _onOnline = () => {
    if (!isConnected && !connection) {
      _forceReconnect()
    }
  }

  document.addEventListener('visibilitychange', _onVisibilityChange)
  window.addEventListener('online', _onOnline)

  function _forceReconnect() {
    cleanup()
    reconnectAttempts = 0
    connect()
  }

  // Автоматически закрываем при размонтировании компонента
  onUnmounted(close)

  connect()

  return { on, off, close }
}