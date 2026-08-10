import type { App } from 'vue'
import { initBus } from '@/app/composables/useBus'

export default {
  install(app: App, methods: Record<string, any> = {}) {
    const bus = initBus(methods)

    // Сохраняем для legacy Options API компонентов, использующих this.$bus
    app.config.globalProperties.$bus = bus
  }
}