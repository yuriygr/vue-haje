import { initApi } from '@/app/composables/useApi'
/**
 * Да, но куда деваться.
 * 
 * @author Боженька <god@heaven>
 * @version 2.0.1
 */
export default {
  install(app, options = {}) {
    initApi(options)
  }
}