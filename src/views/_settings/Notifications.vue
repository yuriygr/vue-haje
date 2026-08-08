<template>
  <group>
    <n-header>{{ t('settings.notifications.events') }}</n-header>

    <form-block>
      <n-checkbox :label="t('settings.notifications.field.mentions')" v-model="form.mentions" :disabled="loading" />
    </form-block>

    <form-block>
      <n-checkbox :label="t('settings.notifications.field.subscriptions')" v-model="form.subscriptions" :disabled="loading" />
    </form-block>

    <form-block>
      <n-checkbox :label="t('settings.notifications.field.new_post')" v-model="form.new_post" :disabled="loading" />
    </form-block>
  </group>

  <group>
    <n-header>{{ t('settings.notifications.feedback') }}</n-header>

    <form-block>
      <n-checkbox :label="t('settings.notifications.field.replies')" v-model="form.replies" :disabled="loading" />
    </form-block>

    <form-block>
      <n-checkbox :label="t('settings.notifications.field.comments')" v-model="form.comments" :disabled="loading" />
    </form-block>
  </group>

  <group>
    <n-header>{{ t('settings.notifications.others') }}</n-header>

    <form-block>
      <n-checkbox :label="t('settings.notifications.field.badges')" v-model="form.badges" :disabled="loading" />
    </form-block>

    <form-block>
      <n-button @click.prevent="submit" tabindex="4" size="l" :disabled="loading">{{ t('action.save') }}</n-button>
    </form-block>
  </group>
</template>

<script>
import { NButton, Group, NHeader, Spacer, Placeholder } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'

import { useMeta } from '@/app/composables/useMeta'
import { useApi } from '@/app/composables/useApi'

export default {
  name: 'settings-notifications',
  components: {
    NButton, Group, NHeader, Spacer, Placeholder
  },
  data() {
    return {
      form: {
        mentions: false,
        subscriptions: false,
        new_post: false,
        replies: false,
        comments: false,
        badges: false
      },

      loading: true
    }
  },
  setup() {
    const { t } = useI18n()
    const api = useApi()
    useMeta(() => ({ title: t('settings.notifications.title') }))

    return { t, api }
  },
  methods: {
    // Fetching
    fetch() {
      this.loading = true
      return this.api.get('settings/notifications')
      .then(result => {
        this.form = result.notifications
      })
      .catch(error => {
        this.$alerts.danger({ text: this.t(`alerts.${error.status}`) })
      })
      .finally(_ => this.loading = false)
    },
    // Submit
    submit() {
      this.loading = true
      return this.api.postJSON('settings/notifications', this.form)
      .then(result => {
        this.$alerts.success({ text: this.t(`alerts.${result.status}`) })

      })
      .catch(error => {
        this.$alerts.danger({ text: this.t(`alerts.${error.status}`) })
      })
      .finally(_ => this.loading = false)
    }
  },
  mounted() {
    this.fetch()
  }
}
</script>