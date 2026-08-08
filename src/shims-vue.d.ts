/* eslint-disable */
import type { useApi } from '@/app/composables/useApi'
import type { initBus } from '@/app/composables/useBus'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: ReturnType<typeof useApi>
    $bus: ReturnType<typeof initBus>
  }
}