<template>
  <group>
    <n-header>{{ $t('settings.delete-account.title') }}</n-header>

    <form-group @submit="submit" :loading="loading">
      <form-text>
        {{ $t('settings.delete-account.help') }}
      </form-text>

      <form-block :label="$t('settings.field.password')">
        <text-field tabindex="1" type="password" name="password" v-model.trim="form.password" :disabled="loading" autocomplete="password" />
      </form-block>

      <form-block>
        <n-checkbox :label="$t('settings.delete-account.apply')" v-model="form.apply" :disabled="loading" />
      </form-block>

      <form-block>
        <n-button tabindex="2" size="l" :disabled="loading || !canSubmit">{{ $t('settings.action.delete_account') }}</n-button>
      </form-block>
    </form-group>
  </group>
</template>

<script>
import { NButton, NHeader, Group } from '@vue-norma/ui'

export default {
  name: 'settings-delete-account',
  components: {
    NButton, NHeader, Group
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('settings.delete-account.title')
      },

      form: {
        password: '',
        apply: false
      },

      loading: false
    }
  },
  computed: {
    canSubmit() {
      return (this.form.password != '') && (this.form.apply)
    }
  },
  methods: {
    submit() {
      this.loading = true
      return this.$api.post('settings/delete-account', this.form)
      .then(result => {
        this.$alerts.success({ text: this.$t(`success.${result.status}`) })

      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`errors.${error.status}`) })
      })
      .then(_ => this.loading = false)
    }
  }
}
</script>

<style>

</style>