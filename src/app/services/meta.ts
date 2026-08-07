import type { App } from 'vue'
import { setMetaOptions } from '@/app/composables/useMeta'

interface MetaPluginOptions {
  defaultTitle?: string | false
  separator?: string
}

export default {
  install(app: App, options: MetaPluginOptions = {}) {
    setMetaOptions(options)
  }
}