import { createPinia } from 'pinia'
import type { PiniaPluginContext } from 'pinia'
import { useApi } from '@/app/composables/useApi'

// Расширяем типы Pinia, чтобы TS знал про store.$api
// на каждом сторе без явного приведения типов при каждом использовании.
// TODO?: Вынести в src/types/pinia.d.ts
declare module 'pinia' {
  export interface PiniaCustomProperties {
    $api: ReturnType<typeof useApi>
  }
}

const pinia = createPinia()

// Добавляем $api в каждый стор
pinia.use(({ store }: PiniaPluginContext) => {
  store.$api = useApi()
})

export default pinia