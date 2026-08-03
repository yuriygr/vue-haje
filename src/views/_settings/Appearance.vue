<template>
  <group>
    <n-header>{{ $t('settings.appearance.title') }}</n-header>

    <form-block :label="$t('settings.appearance.field.theme')">
      <select-field tabindex="1" name="theme" :model-value="store.theme" @change="store.setTheme($event.target.value)">
        <template v-for="key in store.themes" :key="`theme-${key}`">
          <option :value="key" :selected="key == store.theme">{{ $t(`app.theme.${key}`) }}</option>
        </template>
      </select-field>
    </form-block>

    <form-block :label="$t('settings.appearance.field.locale')">
      <select-field tabindex="2" name="locale" :model-value="store.locale" @change="store.setLocale($event.target.value)">
        <template v-for="key in locales" :key="`locale-${key}`">
          <option :value="key" :selected="key == store.locale">{{ $t(`app.locale.${key}`) }}</option>
        </template>
      </select-field>
    </form-block>

    <form-block :label="$t('settings.appearance.field.density')">
      <select-field tabindex="3" name="density" :model-value="store.density" @change="store.setDensity($event.target.value)">
        <template v-for="key in store.densities" :key="`density-${key}`">
          <option :value="key" :selected="key == store.density">{{ $t(`app.density.${key}`) }}</option>
        </template>
      </select-field>
    </form-block>
  </group>
</template>

<script>
import { useAppStore } from '@/app/store/modules/app'
import { NButton, NHeader, Group, Placeholder } from '@vue-norma/ui'

export default {
  name: 'settings-appearance',
  components: {
    NButton, NHeader, Group, Placeholder
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('settings.appearance.title')
      },
      loading: false
    }
  },
  setup() {
    const store = useAppStore()
    return { store }
  },
  computed: {
    locales() {
      return this.$i18n.availableLocales
    }
  }
}
</script>