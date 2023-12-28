<template>
  <group>
    <n-header>{{ $t('settings.profile.avatar.title') }}</n-header>

    <form-text>
      {{ $t('settings.profile.avatar.help') }}
    </form-text>

    <form-block>
      <n-button component="a" href="https://gravatar.com" target="_blank" size="l" icon_after="external-line">{{ $t('action.go_away') }}</n-button>
    </form-block>
  </group>

  <spacer height="40" />

  <group>
    <n-header>{{ $t('settings.profile.data') }}</n-header>

    <form-group @submit="submit" :loading="loading.profile">
      <form-block>
        <div class="l-input">
          <div class="l-input__title">{{ $t('settings.field.name') }}</div>
          <input class="l-input__item" tabindex="1" type="text" name="name">
        </div>
      </form-block>

      <form-block>
        <div class="l-input">
          <div class="l-input__title">{{ $t('settings.field.bio') }}</div>
          <input class="l-input__item" tabindex="2" type="text" name="bio">
        </div>
      </form-block>

      <form-block>
        <div class="l-input">
          <div class="l-input__title">{{ $t('settings.field.sex') }}</div>
          <select class="l-input__item" tabindex="3" type="text" name="sex"></select>
        </div>
      </form-block>

      <form-block>
        <n-button tabindex="4" size="l" :disabled="loading.profile">{{ $t('action.save') }}</n-button>
      </form-block>
    </form-group>
  </group>

  <spacer height="40" />

  <group>
    <n-header>{{ $t('settings.profile.tint.title') }}</n-header>

    <form-group @submit="submit" :loading="loading.tint">
      <form-text>
        {{ $t('settings.profile.tint.help') }}
      </form-text>

      <form-block>
        <n-button tabindex="4" size="l" :disabled="loading.tint">{{ $t('action.save') }}</n-button>
      </form-block>
    </form-group>
  </group>
</template>

<script>
import { NButton, Spacer, Group, NHeader } from '@vue-norma/ui'

export default {
  name: 'settings-profile',
  components: {
    NButton, Spacer, Group, NHeader
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('settings.profile.title')
      },
      loading: {
        profile: false,
        tint: false
      }
    }
  },
  methods: {
    submit() {
      this.loading.profile = true
      setTimeout(_ => {
        alert('@TODO')
        this.loading.profile = false
      }, 900)
    }
  }
}
</script>

<style>

</style>