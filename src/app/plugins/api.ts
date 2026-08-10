import type { App } from 'vue'
import { initApi, useApi, type ApiOptions } from '@/app/composables/useApi'

export default {
  install(app: App, options: ApiOptions) {
    initApi(options)

    // Сохраняем для legacy Options API компонентов, использующих this.$api
    app.config.globalProperties.$api = useApi()
  }
}