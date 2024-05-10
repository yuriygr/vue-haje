<template>
  <group>
    <n-header>{{ $t('settings.connections.title') }}</n-header>
    <placeholder
      :icon="$t('errors.todo.icon')"
      :header="$t('errors.todo.title')"
      :text="$t('errors.todo.description')"
    />
  </group>
</template>

<script>
import { NButton, NHeader, Group, Placeholder } from '@vue-norma/ui'

export default {
  name: 'settings-connections',
  components: {
    NButton, NHeader, Group, Placeholder
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('settings.connections.title')
      }
    }
  }
}
</script>
