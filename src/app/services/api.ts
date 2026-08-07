import type { App } from 'vue'
import { initApi, type ApiOptions } from '@/app/composables/useApi'

export default {
  install(app: App, options: ApiOptions) {
    initApi(options)
  }
}