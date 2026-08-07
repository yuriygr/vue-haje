import type { App } from 'vue'
import mitt from 'mitt'

export default {
  install(app: App, methods = {}) {
    const bus = mitt()

    Object.assign(bus, methods)

    app.config.globalProperties.$bus = bus
  }
}