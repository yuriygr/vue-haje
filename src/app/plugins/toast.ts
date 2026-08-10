import type { App } from 'vue'
import { initToast } from '@/app/composables/useToast'

export default {
  install(app: App, options: { timeout?: number; closable?: boolean } = {}) {
    const toast = initToast(options)

    // Сохраняем для legacy Options API компонентов, использующих this.$toast —
    // тот же подход, что и с $api/$bus
    app.config.globalProperties.$toast = toast
  }
}