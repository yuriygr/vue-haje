<template>

  <group>
    <n-header>{{ t('settings.account.email.title') }}</n-header>

    <form-group @submit="submitEmail" :loading="loading.emailForm">
      <form-text>
        {{ t('settings.account.email.help') }}
      </form-text>
      
      <form-block :label="t('settings.field.email')">
        <text-field tabindex="1" type="email" name="email" v-model.trim="emailForm.email" :disabled="loading.emailForm" />
      </form-block>

      <form-block>
        <n-button tabindex="2" size="l" :disabled="loading.emailForm">{{ t('action.save') }}</n-button>
      </form-block>
    </form-group>
  </group>

  <group>
    <n-header>{{ t('settings.account.verification.title') }}</n-header>

    <form-text>
      {{ t('settings.account.verification.help') }}
    </form-text>

    <form-block>
      <n-button size="l" icon_after="external-line">{{ t('action.go_away') }}</n-button>
    </form-block>
  </group>
</template>

<script>
import { NButton, NHeader, Group, Placeholder } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'

import { useMeta } from '@/app/composables/useMeta'

export default {
  name: 'settings-account',
  components: {
    NButton, NHeader, Group, Placeholder
  },
  data() {
    return {
      emailForm: {
        email: ''
      },

      loading: {
        emailForm: false
      }
    }
  },
  setup() {
    const { t } = useI18n()
    useMeta(() => ({ title: t('settings.account.title') }))

    return { t }
  }
}
</script>
