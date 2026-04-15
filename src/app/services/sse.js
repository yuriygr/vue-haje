/**
 * Небольшая обертка над EventSource.
 * У меня очень замылился глаз когда я все это делал, 
 * по этому, перепишите, кто нибудь
 * 
 * @author Боженька <god@heaven>
 * @version 1.0.0
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

	handlers = new Map()

	install(app, options = {}) {
		this.options = { ...this.options, ...options }

    this.baseURL = this.options.baseURL
    this.withCredentials = this.options.withCredentials

		this.connect()

		app.config.globalProperties.$sse = this
	}

	// Create the connection
	connect() {
		if (this.connection || this.isReconnecting) return;

		this.connection = new EventSource(this.baseURL, {
      withCredentials: this.withCredentials
    })

    this.connection.onopen = event => {
			this.handleConnect(event)
		}

    this.connection.onerror = error => {
			this.handleError(error)
		}

		this.connection.onmessage = event => {
			this.handleMessages(event)
		}

		return this.connection
	}

	// Обрабатываем подключение
	handleConnect(_) {
		this.isConnected = true
		this.isReconnecting = false
		this.reconnectAttempts = 0
	}

	// Обрабатываем ошибку
	handleError() {
		this.isConnected = false

		if (!this.shouldReconnect || this.reconnectAttempts >= this.options.maxReconnectAttempts) {
			console.warn('[SSE] Max reconnect attempts reached, close connection...')
			this.close()
			return
		}

		if (this.isReconnecting) return
		this.isReconnecting = true
		this.isConnected = false

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

	// Обрабатываем дефолтные сообщения
	handleMessages(event) {
		const { type, data } = JSON.parse(event.data)

		if (this.handlers.has(type)) {
			this.handlers.get(type)(data)
		}
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

	// Close and remove a connection 
	close() {
		this.shouldReconnect = false
		this.cleanup()
		this.handlers.clear()
	}

	on(type, callback) {
		if (!this.connection) {
			return console.error('[SSE] Connection not established')
		}

		if (this.handlers.has(type)) {
			return console.error('[SSE] A handler with this type already exists.')
		}

		const handler = (event) => {
			try {
				const data = JSON.parse(event.data)
				callback(data)
			} catch (err) {
				console.error('[SSE] Failed to parse JSON', err)
				return
			}
		}

		this.connection.addEventListener(type, handler)
		this.handlers.set(type, handler)
	}

	off(type) {
		if (!this.connection) return;
		const handler = this.handlers.get(type)
		if (handler) {
			this.connection.removeEventListener(type, handler)
			this.handlers.delete(type)
		}
	}
}
