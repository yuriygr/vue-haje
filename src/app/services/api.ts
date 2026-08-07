import type { App } from 'vue'
import { initApi } from '@/app/composables/useApi'

interface ApiPluginOptions {
  key?: string
  baseURL: string
  version: string
  withCredentials?: boolean
}

export default {
  install(app: App, options: ApiPluginOptions) {
    initApi(options)
  }
}