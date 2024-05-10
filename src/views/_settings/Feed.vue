<template>
  <group>
    <n-header>{{ $t('settings.feed.general.title') }}</n-header>
    <placeholder
      :icon="$t('errors.todo.icon')"
      :header="$t('errors.todo.title')"
      :text="$t('errors.todo.description')"
    />
  </group>

  <group>
    <n-header>{{ $t('settings.feed.custom-feeds.title') }}</n-header>
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
  name: 'settings-feed',
  components: {
    NButton, NHeader, Group, Placeholder
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('settings.feed.title')
      }
    }
  }
}
</script>
