<template>
  <group>
    <n-header>{{ $t('auth.forgot-code.title') }}</n-header>

    <form-group @submit="submit" :loading="loading">
      <form-text>
        {{ $t('auth.forgot-code.suggest') }}
      </form-text>

      <form-block>
        <otp-field v-model="code" />
      </form-block>

      <form-block>
        <n-button size="l" ref="submit" :stretched="true" tabindex="2" :disabled="!canSubmit">{{ $t('auth.button.continue') }}</n-button>
      </form-block>

      <form-block>
        <n-button component="router-link" mode="secondary" :to="{ name: 'auth-forgot' }" :stretched="true">{{ $t('auth.button.back') }}</n-button>
      </form-block>

      <spacer heigth="40" />

      <form-text align="center">
        {{ $t('auth.forgot-code.help') }}
      </form-text>
    </form-group>
  </group>
</template>

<script>
import { NButton, NHeader, Group, Spacer, Placeholder, PlaceholderLoading } from '@vue-norma/ui'

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
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('auth.forgot-code.title')
      },

      error: false,
      loading: false,

      digits: Array(6).fill(''),

      code: '113122'
    }
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
      
      this.$api.post('auth/forgot-code', {
        token: this.token,
        code: this.code
      })
      .then(result => {
        this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })
        this.$router.push({ name: 'auth-forgot-change', params: { token: this.token } })
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
      .then(_ => this.loading = false)
    },
    cleanError(type) {

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
