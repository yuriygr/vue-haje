import type { App } from 'vue'
import { initToast } from '@/app/composables/useToast'

/**
 * Хотелось чего-то простого, человечного
 * 
 * @author Юрий Гринёв <a1d516ac5f5d290@gmail.com>
 * @version 2.0.0
 */
export default {
  install(app: App, options: { timeout?: number; closable?: boolean } = {}) {
    const toast = initToast(options)

    // Сохраняем для legacy Options API компонентов, использующих this.$toast
    app.config.globalProperties.$toast = toast
  }
}