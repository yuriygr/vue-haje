<template>
  <group>
    <n-header>{{ $t('auth.create_account.title') }}</n-header>

    <form-group @submit="submit" :loading="loading">
      <form-status v-if="error"
        mode="error"
        icon="ui-error-warning"
        :header="error.status"
      >
        {{ error.message }}
      </form-status>

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

      <spacer heigth="50" />

      <form-text align="center">
        <i18n-t keypath="auth.create_account.agreement">
          <router-link :to="{ name: 'help-page', params: { uuid: 'user-agreement' } }">{{ $t('auth.create_account.terms') }}</router-link>
          <router-link :to="{ name: 'help-page', params: { uuid: 'privacy' } }">{{ $t('auth.create_account.privacy') }}</router-link>
        </i18n-t>
      </form-text>
    </form-group>
  </group>
</template>

<script>
import { NButton, NHeader, Group, Spacer } from '@vue-norma/ui'

export default {
  name: 'auth-register',
  components: {
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
        password: ''
      }
    }
  },
  computed: {  },
  methods: {
    submit() {
      this.loading = true
      this.error = false

      this.$api.post('auth/register', this.form)
      .then(result => {
        this.$store.dispatch('auth/fetch')
        this.$router.push(this.$route.query.redirect || { name: 'feed' })
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
  mounted() { }
}
</script>
