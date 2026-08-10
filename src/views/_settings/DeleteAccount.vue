<template>
  <group>
    <n-header>{{ t('settings.delete-account.title') }}</n-header>

    <form-group @submit="submit" :loading="loading">
      <form-text>
        {{ t('settings.delete-account.help') }}
      </form-text>

      <form-block :label="t('settings.field.password')">
        <text-field tabindex="1" type="password" name="password" v-model.trim="form.password" :disabled="loading" autocomplete="password" />
      </form-block>

      <form-block>
        <n-checkbox :label="t('settings.delete-account.apply')" v-model="form.apply" :disabled="loading" />
      </form-block>

      <form-block>
        <n-button tabindex="2" size="l" :disabled="loading || !canSubmit">{{ t('settings.action.delete_account') }}</n-button>
      </form-block>
    </form-group>
  </group>
</template>

<script>
import { NButton, NHeader, Group } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'

import { useMeta } from '@/app/composables/useMeta'
import { useApi } from '@/app/composables/useApi'
import { useToast } from '@/app/composables/useToast'
export default {
  name: 'settings-delete-account',
  components: {
    NButton, NHeader, Group
  },
  data() {
    return {
      form: {
        password: '',
        apply: false
      },

      loading: false
    }
  },
  setup() {
    const { t } = useI18n()
    const api = useApi()
    const toast = useToast()
    
    useMeta(() => ({ title: t('settings.delete-account.title') }))

    return { t, api, toast }
  },
  computed: {
    canSubmit() {
      return (this.form.password != '') && (this.form.apply)
    }
  },
  methods: {
    submit() {
      this.loading = true
      return this.api.post('settings/delete-account', this.form)
      .then(result => {
        this.$router.push({ name: 'feed' })
        this.toast.success(this.t(`alerts.${result.status}`))
      })
      .catch(error => {
        this.toast.danger(this.t(`alerts.${error.status}`))
      })
      .finally(_ => this.loading = false)
    }
  }
}
</script>

<style>

</style>