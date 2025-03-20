<template>
  <group>
    <n-header>{{ $t('auth.forgot.title') }}</n-header>

    <form-group @submit="submit" :loading="loading">
      <form-text>
        {{ $t('auth.forgot.suggest') }}
      </form-text>

      <form-block :label="$t('auth.field.email')">
        <text-field tabindex="1" type="email" name="email" v-model.trim="form.email" :disabled="loading" autocomplete="email" />
      </form-block>

      <form-block>
        <n-button size="l" :stretched="true" tabindex="2">{{ $t('auth.button.continue') }}</n-button>
      </form-block>

      <form-block>
        <n-button size="l" component="router-link" mode="secondary" :to="{ name: 'auth-login' }" :stretched="true">{{ $t('auth.button.back') }}</n-button>
      </form-block>

      <spacer heigth="40" />

      <form-text align="center">
        <i18n-t keypath="auth.forgot.help">
          <router-link :to="{ name: 'help-page', params: { uuid: 'contacts' } }">{{ $t('auth.forgot.contact_us') }}</router-link>
        </i18n-t>
      </form-text>
    </form-group>
  </group>
</template>

<script>
import { NButton, NHeader, Group, Spacer } from '@vue-norma/ui'

export default {
  name: 'auth-forgot',
  components: { 
    NButton, NHeader, Group, Spacer
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('auth.forgot.title')
      },
      error: false,
      loading: false,

      form: {}
    }
  },
  computed: {  },
  methods: {
    submit() {
      this.loading = true
      this.error = false
      
      this.$api.post('auth/forgot', this.form)
      .then(result => {
        this.$alerts.success({ text: this.$t(`success.${result.status}`) })
        this.$router.push({ name: 'auth-forgot-code', params: { token: result.payload } })
      })
      .catch(error => {
        this.error = error
        this.$alerts.danger({ text: this.$t(`error.${error.status}`) })
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
  watch: {
    $route(to) {
      this.form = {}
      this.error = false
    }
  },
  mounted() { }
}
</script>
