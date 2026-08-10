import type { App } from 'vue'
import { initBus } from '@/app/composables/useBus'

/**
 * Хотелось чего-то простого, человечного
 * 
 * @author Юрий Гринёв <a1d516ac5f5d290@gmail.com>
 * @version 2.0.0
 */
export default {
  install(app: App, methods: Record<string, any> = {}) {
    const bus = initBus(methods)

    // Сохраняем для legacy Options API компонентов, использующих this.$bus
    app.config.globalProperties.$bus = bus
  }
}