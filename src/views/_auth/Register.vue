<template>
  <group>
    <n-header>{{ $t('auth.create_account.title') }}</n-header>

    <form-group @submit="submit" :loading="loading">
      <form-block :label="$t('auth.field.name')">
        <text-field tabindex="1" type="text" name="name" v-model.trim="form.name" :disabled="loading" autocomplete="name" />
      </form-block>

      <form-block :label="$t('auth.field.username')">
        <text-field tabindex="2" type="text" name="username" v-model.trim="form.username" :disabled="loading" autocomplete="username" />
      </form-block>

      <form-block :label="$t('auth.field.email')">
        <text-field tabindex="3" type="email" name="email" v-model.trim="form.email" :disabled="loading" autocomplete="email" />
      </form-block>

      <form-block :label="$t('auth.field.password')">
        <text-field tabindex="4" type="password" name="password" v-model.trim="form.password" :disabled="loading" autocomplete="password" />
      </form-block>

      <form-block>
        <n-button tabindex="5" size="l" :stretched="true" :disabled="loading">{{ $t('auth.button.continue') }}</n-button>
      </form-block>

      <form-block>
        <n-button component="router-link" mode="secondary" :to="{ name: 'auth-login' }" :stretched="true">{{ $t('auth.create_account.already') }}</n-button>
      </form-block>

      <spacer heigth="40" />

      <form-text align="center">
        <i18n-t keypath="auth.create_account.agreement">
          <router-link :to="{ name: 'help-page', params: { uuid: 'user-agreement' } }">{{ $t('auth.create_account.terms') }}</router-link>
          <router-link :to="{ name: 'help-page', params: { uuid: 'privacy' } }">{{ $t('auth.create_account.privacy') }}</router-link>
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
import { mapState } from 'vuex'
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';

import { NButton, NHeader, Group, Spacer } from '@vue-norma/ui'

export default {
  name: 'auth-register',
  components: {
    VueHcaptcha,
    NButton, NHeader, Group, Spacer
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('auth.create_account.title')
      },
      error: false,
      loading: false,

      form: {
        name: '',
        username: '',
        email: '',
        password: '',
        'h-captcha-response': ''
      }
    }
  },
  computed: {
    ...mapState('app', [ 'theme' ]),
  },
  methods: {
    async submit() {
      this.loading = true
      this.error = false

      await this.$refs.captcha.executeAsync()

      this.$api.post('auth/register', this.form)
      .then(result => {
        this.$store.dispatch('auth/fetch')
        this.$router.push(this.$route.query.redirect || { name: 'feed' })
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
