import mitt from 'mitt';

/**
 * Устанавливаем mitt как глобальное свойство
 */
export default {
  install(app, methods = {}) {
    const bus = mitt()

    Object.assign(bus, methods)

    app.config.globalProperties.$bus = bus
  }
}