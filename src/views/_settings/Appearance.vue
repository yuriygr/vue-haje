<template>
  <group>
    <n-header>{{ $t('settings.appearance.title') }}</n-header>
    <form-group @submit="submit" :loading="loading">

      <form-block :label="$t('settings.field.theme')">
        <select-field tabindex="1" name="theme" v-model="theme" @change="change('theme', $event)">
          <template v-for="key in themes" :key="`theme-${key}`">
            <option :value="key" :selected="key == theme">{{ $t(`app.theme.${key}`) }}</option>
          </template>
        </select-field>
      </form-block>

      <form-block :label="$t('settings.field.locale')">
        <select-field tabindex="2" name="locale" v-model="locale" @change="change('locale', $event)">
          <template v-for="key in locales" :key="`locale-${key}`">
            <option :value="key" :selected="key == locale">{{ $t(`app.locale.${key}`) }}</option>
          </template>
        </select-field>
      </form-block>
    </form-group>
  </group>
</template>

<script>
import { mapState } from 'vuex'
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
  computed: {
    ...mapState('app', [ 'locale', 'theme' ]),
    themes() {
      return [
        'white', 'black'
      ]
    },
    locales() {
      return this.$i18n.availableLocales
    }
  },
  methods: {
    change(type, event) {
      let method
      switch (type) {
        case 'locale':
          method = 'SET_LOCALE'
          break;
        case 'theme':
          method = 'SET_THEME'
          break;
        default:
          return false
      }
      this.$store.commit(`app/${method}`, event.target.value)
    }
  }
}
</script>
