import type { App } from 'vue'
import { setMetaOptions, type MetaOptions } from '@/app/composables/useMeta'

export default {
  install(app: App, options: MetaOptions) {
    setMetaOptions(options)
  }
}