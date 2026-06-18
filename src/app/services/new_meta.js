import { setMetaOptions } from '@/app/composables/useMeta'
/**
 * Да, но куда деваться.
 * 
 * @author Боженька <god@heaven>
 * @version 2.0.1
 */
export default {
  install(app, options = {}) {
    setMetaOptions(options)
  }
}