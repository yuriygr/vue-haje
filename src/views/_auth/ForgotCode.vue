<template>
  <group>
    <n-header>{{ t('auth.forgot-code.title') }}</n-header>

    <form-group @submit="submit" :loading="loading">
      <form-text>
        {{ t('auth.forgot-code.suggest') }}
      </form-text>

      <form-block>
        <otp-field v-model="code" />
      </form-block>

      <form-block>
        <n-button size="l" ref="submit" :stretched="true" tabindex="2" :disabled="!canSubmit">{{ t('auth.button.continue') }}</n-button>
      </form-block>

      <form-block>
        <n-button component="router-link" mode="secondary" :to="{ name: 'auth-forgot' }" :stretched="true">{{ t('auth.button.back') }}</n-button>
      </form-block>

      <spacer heigth="40" />

      <form-text align="center">
        {{ t('auth.forgot-code.help') }}
      </form-text>
    </form-group>
  </group>
</template>

<script>
import { NButton, NHeader, Group, Spacer, Placeholder, PlaceholderLoading } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'

import { useMeta } from '@/app/composables/useMeta'
import { useApi } from '@/app/composables/useApi'
import { useToast } from '@/app/composables/useToast'

export default {
  name: 'auth-forgot-code',
  components: { 
    NButton, NHeader, Group, Spacer, Placeholder, PlaceholderLoading
  },
  props: {
    token: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      error: false,
      loading: false,

      digits: Array(6).fill(''),

      code: ''
    }
  },
  setup() {
    const { t } = useI18n()
    const api = useApi()
    const toast = useToast()

    useMeta(() => ({ title: t('auth.forgot-code.title') }))

    return { t, api, toast }
  },
  computed: {
    canSubmit() {
      return (this.code.trim() != '') && !this.loading
    },
  },
  methods: {
    submit() {
      this.loading = true
      this.error = false
      
      return this.api.post('auth/forgot-code', {
        token: this.token,
        code: this.code
      })
      .then(result => {
        this.toast.success(this.t(`alerts.${result.status}`))
        this.$router.push({ name: 'auth-forgot-change', params: { token: this.token } })
      })
      .catch(error => {
        this.toast.danger(this.t(`alerts.${error.status}`))
      })
      .finally(_ => this.loading = false)
    },

    helpLink() {
      return {
        name: 'help', params: { uuid: 'contact-us' }
      }
    }
  },
  mounted() {

  },
  watch: {
    $route(to) {
      this.code = ''
      this.error = false
    }
  }
}
</script>
