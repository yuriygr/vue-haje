<template>
  <group>
    <n-header>{{ $t('auth.forgot-change.title') }}</n-header>

    <form-group @submit="submit" :loading="loading">
      <form-text>
        {{ $t('auth.forgot-change.suggest') }}
      </form-text>

      <form-block :label="$t('auth.field.password')">
        <text-field tabindex="1" type="password" name="password" v-model.trim="password" :disabled="loading" autocomplete="password" />
      </form-block>

      <form-block>
        <n-button size="l" :stretched="true" tabindex="2" :disabled="loading">{{ $t('auth.button.save') }}</n-button>
      </form-block>
    </form-group>
  </group>
</template>

<script>
import { NButton, NHeader, Group, Spacer } from '@vue-norma/ui'

export default {
  name: 'auth-forgot-change',
  components: { 
    NButton, NHeader, Group, Spacer
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
        title: this.$t('auth.forgot-change.title')
      },
      error: false,
      loading: false,

      password: ''
    }
  },
  computed: {
    canSubmit() {
      return (this.password.trim() != '') && !this.loading
    },
  },
  methods: {
    submit() {
      this.loading = true
      this.error = false
      
      this.$api.post('auth/forgot-change', {
        token: this.token,
        password: this.password
      })
      .then(result => {
        this.$alerts.success({ text: this.$t(`success.${result.status}`) })

      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`error.${error.status}`) })
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
