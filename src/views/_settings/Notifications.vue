<template>
  <group>
    <n-header>{{ $t('settings.notifications.site.title') }}</n-header>

  </group>

  <spacer height="40" />

  <group>
    <n-header>{{ $t('settings.notifications.email.title') }}</n-header>

  </group>
</template>

<script>
import { NButton, Group, NHeader, Spacer } from '@vue-norma/ui'

export default {
  name: 'settings-notifications',
  components: {
    NButton, Group, NHeader, Spacer
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('settings.notifications.title')
      },
      loading: false
    }
  },
  methods: {
    changeValue() {
      alert('@TODO')
    }
  }
}
</script>

<style>

</style>