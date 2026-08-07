<template>
  <group>
    <n-header>{{ t('settings.connections.connected') }}</n-header>
    <placeholder
      :icon="t('errors.todo.icon')"
      :header="t('errors.todo.title')"
      :text="t('errors.todo.description')"
    />
    <n-header>{{ t('settings.connections.available') }}</n-header>
    <placeholder
      :icon="t('errors.todo.icon')"
      :header="t('errors.todo.title')"
      :text="t('errors.todo.description')"
    />
  </group>
</template>

<script>
import { NButton, NHeader, Group, Placeholder } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'

import { useMeta } from '@/app/composables/useMeta'

export default {
  name: 'settings-connections',
  components: {
    NButton, NHeader, Group, Placeholder
  },
  setup() {
    const { t } = useI18n()
    useMeta(() => ({ title: t('settings.connections.title') }))

    return { t }
  },
}
</script>
