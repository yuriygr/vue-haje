<template>
  <group>
    <n-header>{{ $t('donate.title') }}</n-header>
    <placeholder
      :icon="$t('errors.todo.icon')"
      :header="$t('errors.todo.title')"
      :text="$t('errors.todo.description')"
    />
  </group>
</template>

<script>
import { Placeholder, Group, NHeader } from '@vue-norma/ui'

export default {
  name: 'donate',
  components: { Placeholder, Group, NHeader },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('donate.title')
      },
    }
  },
  computed: { }
}
</script>