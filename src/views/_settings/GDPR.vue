<template>
  <group>
    <n-header>{{ t('settings.gdpr.title') }}</n-header>

    <form-group @submit="submit" :loading="loading">
      <form-text>
        {{ t('settings.gdpr.help') }}
      </form-text>

     <form-block :label="t('settings.field.password')">
        <text-field tabindex="1" type="password" name="password" v-model.trim="form.password" :disabled="loading" autocomplete="password" />
      </form-block>

      <form-block>
        <n-button tabindex="2" size="l" :disabled="loading">{{ t('settings.action.request_data') }}</n-button>
      </form-block>
    </form-group>
  </group>
</template>

<script>
import { NButton, NHeader, Group } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'

import { useMeta } from '@/app/composables/useMeta'

export default {
  name: 'settings-gdpr',
  components: {
    NButton, NHeader, Group
  },
  data() {
    return {
      loading: false,
      form: {
        password: ''
      }
    }
  },
  setup() {
    const { t } = useI18n()
    useMeta(() => ({ title: t('settings.gdpr.title') }))

    return { t }
  },
  methods: {
    submit() {
      alert('@TODO')
    }
  }
}
</script>