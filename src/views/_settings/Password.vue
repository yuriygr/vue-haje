<template>
  <group>
    <n-header>{{ $t('settings.password.title') }}</n-header>

    <form-group @submit="submit" :loading="loading">
      <form-text>
        {{ $t('settings.password.help') }}
      </form-text>

      <form-block>
        <div class="l-input">
          <div class="l-input__title">{{ $t('settings.field.current_password') }}</div>
          <input class="l-input__item" tabindex="1" type="password" name="current_password" v-model.trim="form.current_password" autocomplete="current-password">
        </div>
      </form-block>

      <form-block>
        <div class="l-input">
          <div class="l-input__title">{{ $t('settings.field.new_password') }}</div>
          <input class="l-input__item" tabindex="2" type="password" name="new_password" v-model.trim="form.new_password" autocomplete="new-password">
        </div>
      </form-block>

      <form-block>
        <n-button tabindex="3" size="l" :disabled="loading">{{ $t('settings.action.change_password') }}</n-button>
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
      loading: false,
      form: {
        current_password: '',
        new_password: ''
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