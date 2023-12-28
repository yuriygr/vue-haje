<template>
  <group>
    <n-header>{{ $t('auth.reset-password.title') }}</n-header>

    <form-group @submit="submit" :loading="loading">
      <form-text>
        {{ $t('auth.reset-password.suggest') }}
      </form-text>

      <form-block>
        <div class="l-input --password">
          <div class="l-input__title">{{ $t('auth.field.password') }}</div>
          <input v-validation class="l-input__item" tabindex="1" type="password" name="password" v-model.trim="form.password" autocomplete="password">
        </div>
      </form-block>

      <form-block>
        <n-button size="l" :stretched="true" tabindex="2">{{ $t('auth.button.continue') }}</n-button>
      </form-block>

      <form-block>
        <n-button component="router-link" mode="secondary" :to="{ name: 'auth-login' }" :stretched="true">{{ $t('auth.reset-password.remember') }}</n-button>
      </form-block>
      
      <spacer heigth="50" />

      <form-text align="center">
        <i18n-t keypath="auth.reset-password.help">
          <router-link :to="{ name: 'help-page', params: { uuid: 'contact-us' } }">{{ $t('auth.reset-password.contact_us') }}</router-link>
        </i18n-t>
      </form-text>
    </form-group>
  </group>
</template>

<script>
import { NButton, NHeader, Group, Spacer } from '@vue-norma/ui'

export default {
  name: 'auth-reset-password',
  components: { 
    NButton, NHeader, Group, Spacer
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('auth.reset-password.title')
      },
      error: false,
      loading: false,

      form: {
        code: '',
        password: ''
      }
    }
  },
  computed: {  },
  methods: {
    submit() {
      this.loading = true
      this.error = false
      
      this.$api.post('auth/reset-password', this.form)
      .then(result => {
        this.$alerts.success({ text: result.status })
        this.$router.push({ name: 'auth-reset-password' })
      })
      .catch(error => {
        this.error = error
      })
      .then(_ => this.loading = false)
    },
    cleanError(type) {

    }
  },
  watch: {
    $route(to) {
      this.form = {}
      this.error = false
    }
  },
  mounted() {}
}
</script>
