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

    <n-header>{{ $t('settings.notifications.feedback') }}</n-header>

    <form-block>
      <n-checkbox :label="$t('settings.notifications.field.replies')" v-model="form.replies" disabled="true" />
    </form-block>

    <n-header>{{ $t('settings.notifications.others') }}</n-header>

    <form-block>
      <n-checkbox :label="$t('settings.notifications.field.badges')" v-model="form.badges" disabled="true" />
    </form-block>

    <form-block>
      <n-button @click.prevent="submit" tabindex="4" size="l" :disabled="loading">{{ $t('action.save') }}</n-button>
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

      loading: true
    }
  },
  methods: {
    // Fetching
    fetch() {
      this.loading = true
      return this.$api.get('settings/notifications')
      .then(result => {
        console.log(result)
        this.form = result
      })
      .catch(error => {
        this.$alerts.danger({ text: error.status })
      })
      .then(_ => this.loading = false)
    },
    // Submit
    submit() {
      this.loading = true
      return this.$api.post('settings/notifications', this.form)
      .then(result => {
        this.$alerts.success({ text: result.status })
      })
      .catch(error => {
        this.$alerts.danger({ text: error.status })
      })
      .then(_ => this.loading = false)
    }
  },
  async mounted() {
    await this.fetch()
  }
}
</script>

<style>

</style>