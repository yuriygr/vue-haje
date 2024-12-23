<template>

  <group>
    <n-header>{{ $t('settings.account.email.title') }}</n-header>

    <form-group @submit="submitEmail" :loading="loading.emailForm">
      <form-text>
        {{ $t('settings.account.email.help') }}
      </form-text>
      
      <form-block :label="$t('settings.field.email')">
        <text-field tabindex="1" type="email" name="email" v-model.trim="emailForm.email" :disabled="loading.emailForm" />
      </form-block>

      <form-block>
        <n-button tabindex="2" size="l" :disabled="loading.emailForm">{{ $t('action.save') }}</n-button>
      </form-block>
    </form-group>
  </group>

  <group>
    <n-header>{{ $t('settings.account.verification.title') }}</n-header>

    <form-text>
      {{ $t('settings.account.verification.help') }}
    </form-text>

    <form-block>
      <n-button size="l" icon_after="external-line">{{ $t('action.go_away') }}</n-button>
    </form-block>
  </group>
</template>

<script>
import { NButton, NHeader, Group, Placeholder } from '@vue-norma/ui'

export default {
  name: 'settings-account',
  components: {
    NButton, NHeader, Group, Placeholder
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('settings.account.title')
      },

      emailForm: {
        email: ''
      },

      loading: {
        emailForm: false
      }
    }
  }
}
</script>
