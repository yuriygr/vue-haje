import type { App } from 'vue'

// app components & services
import router from '@/app/router'
import store from '@/app/store'
import i18n from '@/app/locales'
import { api, toast, meta, bus } from '@/app/plugins'
import { popover, directives, global_ui } from '@/app/services'

import type { ApiOptions } from '@/app/composables/useApi'
import type { MetaOptions } from '@/app/composables/useMeta'
import type { ToastOptions } from '@/app/composables/useToast'

interface NormaOptions {
  api: ApiOptions
  meta: Partial<MetaOptions>
  toast: Partial<ToastOptions>
}

export default new class {
	options: NormaOptions = {
    api: {
      key:     process.env.VUE_APP_API_KEY,
      baseURL: process.env.VUE_APP_API_ENDPOINT as string,
      version: process.env.VUE_APP_API_VERSION as string
    },
    meta: {
      defaultTitle: process.env.VUE_APP_TITLE ?? false
    },
    toast: {
      timeout: 3600,
      closable: true
    }
  }

  install(app: App, options: Partial<NormaOptions> = {}) {
		this.options = { ...this.options, ...options }
  
    // Плагины
    app.use(api, this.options.api)
    app.use(toast, this.options.toast)
    app.use(meta, this.options.meta)
    app.use(bus)

    // Компоненты
    app.use(store)
    app.use(router, app)
    app.use(i18n)
    
    // Требуется рефакторинг
    app.use(popover)
    app.use(global_ui)
    app.use(directives)
  }
}