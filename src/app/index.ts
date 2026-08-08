import type { App } from 'vue'

// app components & services
import router from '@/app/router'
import store from '@/app/store'
import i18n from '@/app/locales'
import { api, alerts, meta, popover, bus, directives, global_ui } from '@/app/services'
//import { toast } from '@vue-norma/ui'

import type { ApiOptions } from '@/app/composables/useApi'
import type { MetaOptions } from '@/app/composables/useMeta'

interface NormaOptions {
  api: ApiOptions
  meta: Partial<MetaOptions>
}

/**
 * Потому что мне так удобно.
 * 
 * @author Боженька <god@heaven>
 * @version 2.0.0
 */
export default new class {
	options: NormaOptions = {
    api: {
      key:     process.env.VUE_APP_API_KEY,
      baseURL: process.env.VUE_APP_API_ENDPOINT as string,
      version: process.env.VUE_APP_API_VERSION as string
    },
    meta: {
      defaultTitle: process.env.VUE_APP_TITLE ?? false
    }
  }

  install(app: App, options: Partial<NormaOptions> = {}) {
		this.options = { ...this.options, ...options }
    
    // Требуется рефакторинг
    app.use(alerts)
    app.use(popover)
    app.use(global_ui)

  
    //app.use(toast)
    app.use(api, this.options.api)
    app.use(bus)
    app.use(directives)
    app.use(meta, this.options.meta)

    app.use(store)
    app.use(router, app)
    app.use(i18n)
  }
}