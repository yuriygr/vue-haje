<template>
  <group>
    <n-header>{{ $t('settings.password.title') }}</n-header>

    <form-group @submit="submit" :loading="loading">
      <form-text>
        {{ $t('settings.password.help') }}
      </form-text>

      <form-block :label="$t('settings.field.current_password')">
        <text-field tabindex="1" type="password" name="current_password" v-model.trim="form.current_password" :disabled="loading" autocomplete="current-password" />
      </form-block>

      <form-block :label="$t('settings.field.new_password')">
        <text-field tabindex="2" type="password" name="new_password" v-model.trim="form.new_password" :disabled="loading" autocomplete="new-password" />
      </form-block>

      <form-block>
        <n-checkbox :label="$t('settings.password.apply')" v-model="form.apply" :disabled="loading" />
      </form-block>

      <form-block>
        <n-button tabindex="3" size="l" :disabled="loading || !canSubmit">{{ $t('settings.action.change_password') }}</n-button>
      </form-block>
    </form-group>
  </group>
</template>

<script>
import { NButton, NHeader, Group } from '@vue-norma/ui'

export default {
  name: 'settings-password',
  components: {
    NButton, NHeader, Group
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('settings.password.title')
      },

      form: {
        current_password: '',
        new_password: '',
        apply: false
      },

      loading: false
    }
  },
  computed: {
    canSubmit() {
      return (this.form.current_password != '') && (this.form.new_password != '') && (this.form.apply)
    }
  },
  methods: {
    validate() {

    },
    submit() {
      this.loading = true
      return this.$api.post('settings/password', this.form)
      .then(result => {
        this.$alerts.success({ text: result.status })
      })
      .catch(error => {
        this.$alerts.danger({ text: error.status })
      })
      .then(_ => this.loading = false)
    }
  }
}
</script>

<style>

</style>