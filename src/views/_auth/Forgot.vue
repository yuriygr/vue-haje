<template>
  <group>
    <n-header>{{ $t('auth.forgot.title') }}</n-header>

    <form-group @submit="submit" :loading="loading">
      <form-status v-if="error"
        mode="error"
        icon="ui-error-warning"
        :header="error.status"
      >
        {{ error.message }}
      </form-status>

      <form-text>
        {{ $t('auth.forgot.suggest') }}
      </form-text>

      <form-block>
        <div class="l-input">
          <div class="l-input__title">{{ $t('auth.field.email') }}</div>
          <input v-validation class="l-input__item" tabindex="1" type="email" name="email" v-model.trim="form.email"  autocomplete="username">
        </div>
      </form-block>

      <form-block>
        <n-button size="l" :stretched="true" tabindex="2">{{ $t('auth.button.continue') }}</n-button>
      </form-block>

      <form-block>
        <n-button component="router-link" mode="secondary" :to="{ name: 'auth-login' }" :stretched="true">{{ $t('auth.forgot.remember') }}</n-button>
      </form-block>

      <spacer heigth="50" />

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
        this.$alerts.success({ text: result.status })
        this.$router.push({ name: 'auth-reset-password' })
      })
      .catch(error => {
        this.error = error
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
