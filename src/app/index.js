// app components & services
import router from '@/app/router'
import store from '@/app/store'
import i18n from '@/app/locales'
import { api, alerts, meta, old_api, popover, bus, directives, global_ui } from '@/app/services'
//import { toast } from '@vue-norma/ui'


/**
 * Потому что мне так удобно.
 * 
 * @author Боженька <god@heaven>
 * @version 1.0.1
 */
export default new class {
	options = {
    api: {
      key:     process.env.VUE_APP_API_KEY,
      baseURL: process.env.VUE_APP_API_ENDPOINT,
      version: process.env.VUE_APP_API_VERSION
    },
    meta: {
      defaultTitle: process.env.VUE_APP_TITLE
    }
  }

  install(app, options = {}) {
		this.options = { ...this.options, ...options }

    app.use(router, app)
    app.use(directives)
    app.use(global_ui)
    app.use(bus)
  
    app.use(old_api, this.options.api)
    app.use(alerts)
    app.use(popover)

    // Рефакторинг - В С Ё
    //app.use(toast)
    app.use(api, this.options.api)
    app.use(meta, this.options.meta)
    app.use(store)
    app.use(i18n)
  }
}