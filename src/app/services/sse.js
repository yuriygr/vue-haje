/**
 * Небольшая обертка над EventSource.
 *
 * @author Боженька <god@heaven>
 * @version 1.3.0
 */
export default new class {
  options = {
    baseURL: false,
    withCredentials: true,
    maxReconnectAttempts: 3,
    reconnectDelay: 1000
  }

  connection = null

  isConnected = false
  isReconnecting = false
  shouldReconnect = true

  reconnectTimer = null
  reconnectAttempts = 0

  // Храним { callback, handler } чтобы корректно снимать addEventListener
  handlers = new Map()

  // Ссылки на листенеры для корректного removeEventListener при close()
  _onVisibilityChange = null
  _onOnline = null

  install(app, options = {}) {
    this.options = { ...this.options, ...options }

    this.connect()
    this._bindAppLifecycle()

    app.config.globalProperties.$sse = this
  }

  // Детектим возврат в приложение и восстановление сети
  _bindAppLifecycle() {
    this._onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !this.isConnected) {
        this._forceReconnect()
      }
    }

    this._onOnline = () => {
      if (!this.isConnected) {
        this._forceReconnect()
      }
    }

    document.addEventListener('visibilitychange', this._onVisibilityChange)
    window.addEventListener('online', this._onOnline)
  }

  // Переподключение без учёта текущего состояния isReconnecting
  _forceReconnect() {
    this.cleanup()
    this.reconnectAttempts = 0
    this.connect()
  }

  connect() {
    // Не открываем дубль если уже есть живое соединение
    if (this.connection) return

    this.connection = new EventSource(this.options.baseURL, {
      withCredentials: this.options.withCredentials
    })

    this.connection.onopen = event => this.handleConnect(event)
    this.connection.onerror = error => this.handleError(error)

    // Переподписываем именованные хендлеры на новый connection
    for (const [type, { handler }] of this.handlers) {
      this.connection.addEventListener(type, handler)
    }

    return this.connection
  }

  handleConnect(_) {
    this.isConnected = true
    this.isReconnecting = false
    this.reconnectAttempts = 0
  }

  handleError() {
    this.isConnected = false

    if (!this.shouldReconnect || this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      console.warn('[SSE] Max reconnect attempts reached, closing connection...')
      this.close()
      return
    }

    if (this.isReconnecting) return
    this.isReconnecting = true

    this.reconnectAttempts++

    const delay = Math.min(
      this.options.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      30000
    )

    this.reconnectTimer = setTimeout(() => {
      this.cleanup()
      this.connect()
    }, delay)
  }

  cleanup() {
    this.isReconnecting = false

    if (this.connection) {
      this.connection.close()
      this.connection = null
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  close() {
    this.shouldReconnect = false
    this.cleanup()
    this.handlers.clear()

    if (this._onVisibilityChange) {
      document.removeEventListener('visibilitychange', this._onVisibilityChange)
    }
    if (this._onOnline) {
      window.removeEventListener('online', this._onOnline)
    }
  }

  on(type, callback) {
    if (this.handlers.has(type)) {
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

    // Сохраняем и callback (для возможного будущего использования) и handler
    this.handlers.set(type, { callback, handler })

    if (this.connection) {
      this.connection.addEventListener(type, handler)
    } else {
      console.warn('[SSE] on() called before connection — handler queued, will attach on connect()')
    }
  }

  off(type) {
    const entry = this.handlers.get(type)
    if (!entry) return

    if (this.connection) {
      this.connection.removeEventListener(type, entry.handler)
    }

    this.handlers.delete(type)
  }
}