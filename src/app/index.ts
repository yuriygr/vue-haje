/**
 * Думаю, это самая Norma'льная реализация такого
 * 
 * @author Юрий Гринёв <a1d516ac5f5d290@gmail.com>
 * @version 2.0.0
 */
import type { App, Plugin } from 'vue'

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

const defaultOptions: NormaOptions = {
  api: {
    key: process.env.VUE_APP_API_KEY,
    baseURL: process.env.VUE_APP_API_ENDPOINT as string,
    version: process.env.VUE_APP_API_VERSION as string,
  },
  meta: {
    defaultTitle: process.env.VUE_APP_TITLE ?? false,
  },
  toast: {
    timeout: 3600,
    closable: true,
  },
}

export const Norma: Plugin<[Partial<NormaOptions>?]> = {
  install(app: App, options: Partial<NormaOptions> = {}) {
    const merged: NormaOptions = { ...defaultOptions, ...options }

    // Плагины
    app.use(api, merged.api)
    app.use(toast, merged.toast)
    app.use(meta, merged.meta)
    app.use(bus)

    // Компоненты
    app.use(store)
    app.use(router, app)
    app.use(i18n)

    // Требуется рефакторинг
    app.use(popover)
    app.use(global_ui)
    app.use(directives)
  },
}

export default Norma