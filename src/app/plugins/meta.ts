import type { App } from 'vue'
import { setMetaOptions, type MetaOptions } from '@/app/composables/useMeta'

/**
 * Хотелось чего-то простого, человечного
 * 
 * @author Юрий Гринёв <a1d516ac5f5d290@gmail.com>
 * @version 2.0.0
 */
export default {
  install(app: App, options: MetaOptions) {
    setMetaOptions(options)
  }
}