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
        <n-button component="router-link" mode="secondary" :to="{ name: 'auth-login' }" :stretched="true">{{ $t('auth.button.back') }}</n-button>
      </form-block>

      <spacer heigth="40" />

      <form-text align="center">
        <i18n-t keypath="auth.forgot.help">
          <router-link :to="{ name: 'help-page', params: { uuid: 'contacts' } }">{{ $t('auth.forgot.contact_us') }}</router-link>
        </i18n-t>
      </form-text>
    </form-group>
  </group>

  <VueHcaptcha
    ref="captcha"
    size="invisible"
    sitekey="b4328fc2-4178-4216-89e0-0694bbeeff18"
    :theme="theme == 'black'?'dark':'light'"
    @verify="onVerify" 
    @expired="onExpire"
    @closed="onClosed"
    @challenge-expired="onExpire"
  />
</template>

<script>
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import { NButton, NHeader, Group, Spacer } from '@vue-norma/ui'

export default {
  name: 'auth-forgot',
  components: { 
    VueHcaptcha,
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

      form: {
        email: '',
        'h-captcha-response': ''
      }
    }
  },
  computed: {  },
  methods: {
    async submit() {
      this.loading = true
      this.error = false

      await this.$refs.captcha.executeAsync()
      
      this.$api.post('auth/forgot', this.form)
      .then(result => {
        this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })
        this.$router.push({ name: 'auth-forgot-code', params: { token: result.payload } })
      })
      .catch(error => {
        this.error = error
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
        this.form['h-captcha-response'] = ''
        this.$refs.captcha.reset()
      })
      .then(_ => this.loading = false)
    },
    cleanError(type) {

    },
    helpLink() {
      return {
        name: 'help', params: { uuid: 'contact-us' }
      }
    },
    // captcha
    onVerify(token, ekey) {
      this.form['h-captcha-response'] = token
    },
    onExpire() {
      this.form['h-captcha-response'] = ''
    },
    onClosed() {
      this.loading = false
      this.error = false
      this.form['h-captcha-response'] = ''
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
