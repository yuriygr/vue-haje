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
        <n-checkbox :label="$t('settings.delete-account.apply')" v-model="form.apply"  />
      </form-block>

      <form-block>
        <n-button tabindex="2" size="l" :disabled="loading">{{ $t('settings.action.delete_account') }}</n-button>
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
      loading: false,
      form: {
        password: '',
        apply: true
      }
    }
  },
  methods: {
    submit() {
      alert('@TODO')
    }
  }
}
</script>

<style>

</style>