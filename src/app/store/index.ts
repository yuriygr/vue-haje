import { createPinia } from 'pinia'
import type { PiniaPluginContext } from 'pinia'
import { useApi } from '@/app/composables/useApi'

const pinia = createPinia()

// Добавляем $api в каждый стор
pinia.use(({ store }: PiniaPluginContext) => {
  store.$api = useApi()
})

export default pinia