<template>
  <group>
    <n-header>{{ $t('settings.notifications.events') }}</n-header>

    <form-block>
      <n-checkbox :label="$t('settings.notifications.field.mentions')" v-model="form.mentions" disabled="true" />
    </form-block>

    <form-block>
      <n-checkbox :label="$t('settings.notifications.field.subscriptions')" v-model="form.subscriptions" disabled="true" />
    </form-block>

    <form-block>
      <n-checkbox :label="$t('settings.notifications.field.new_post')" v-model="form.new_post" disabled="true" />
    </form-block>
  </group>

  <spacer height="40" />

  <group>
    <n-header>{{ $t('settings.notifications.feedback') }}</n-header>

    <form-block>
      <n-checkbox :label="$t('settings.notifications.field.replies')" v-model="form.replies" disabled="true" />
    </form-block>
  </group>

  <spacer height="40" />

  <group>
    <n-header>{{ $t('settings.notifications.others') }}</n-header>
    <form-block>
      <n-checkbox :label="$t('settings.notifications.field.badges')" v-model="form.badges" disabled="true" />
    </form-block>
  </group>
</template>

<script>
import { NButton, Group, NHeader, Spacer, Placeholder } from '@vue-norma/ui'

export default {
  name: 'settings-notifications',
  components: {
    NButton, Group, NHeader, Spacer, Placeholder
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('settings.notifications.title')
      },

      form: {
        mentions: true,
        subscriptions: true,
        new_post: true,
        replies: true,
        badges: false
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