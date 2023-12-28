<template>
  <group>
    <n-header>{{ $t('settings.gdpr.title') }}</n-header>

    <form-group @submit="submit" :loading="loading">
      <form-text>
        {{ $t('settings.gdpr.help') }}
      </form-text>

      <form-block>
        <div class="l-input --password">
          <div class="l-input__title">{{ $t('settings.field.password') }}</div>
          <input class="l-input__item" tabindex="1" type="password" name="password" v-model.trim="form.password" />
        </div>
      </form-block>

      <form-block>
        <n-button tabindex="2" size="l" :disabled="loading">{{ $t('settings.action.request_data') }}</n-button>
      </form-block>
    </form-group>
  </group>
</template>

<script>
import { NButton, NHeader, Group } from '@vue-norma/ui'

export default {
  name: 'settings-gdpr',
  components: {
    NButton, NHeader, Group
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('settings.gdpr.title')
      },
      loading: false,
      form: {
        password: ''
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