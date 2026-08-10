import type { App } from 'vue'
import { initApi, useApi, type ApiOptions } from '@/app/composables/useApi'

/**
 * Хотелось чего-то простого, человечного
 * 
 * @author Юрий Гринёв <a1d516ac5f5d290@gmail.com>
 * @version 2.0.0
 */
export default {
  install(app: App, options: ApiOptions) {
    initApi(options)

    // Сохраняем для legacy Options API компонентов, использующих this.$api
    app.config.globalProperties.$api = useApi()
  }
}