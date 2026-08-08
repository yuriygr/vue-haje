<template>
  <group>
    <n-header>{{ t('settings.appearance.title') }}</n-header>

    <form-block :label="t('settings.appearance.field.theme')">
      <select-field tabindex="1" name="theme" :model-value="store.theme" @change="store.setTheme($event.target.value)">
        <template v-for="key in store.themes" :key="`theme-${key}`">
          <option :value="key" :selected="key == store.theme">{{ t(`app.theme.${key}`) }}</option>
        </template>
      </select-field>
    </form-block>

    <form-block :label="t('settings.appearance.field.locale')">
      <select-field tabindex="2" name="locale" :model-value="store.locale" @change="store.setLocale($event.target.value)">
        <template v-for="key in locales" :key="`locale-${key}`">
          <option :value="key" :selected="key == store.locale">{{ t(`app.locale.${key}`) }}</option>
        </template>
      </select-field>
    </form-block>

    <form-block :label="t('settings.appearance.field.density')">
      <select-field tabindex="3" name="density" :model-value="store.density" @change="store.setDensity($event.target.value)">
        <template v-for="key in store.densities" :key="`density-${key}`">
          <option :value="key" :selected="key == store.density">{{ t(`app.density.${key}`) }}</option>
        </template>
      </select-field>
    </form-block>
  </group>
</template>

<script setup>
import { computed } from 'vue'
import { NHeader, Group } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'

import { useMeta } from '@/app/composables/useMeta'
import { useAppStore } from '@/app/store/modules/app'

defineOptions({
  name: 'settings-appearance'
})

// Composables
const { t, availableLocales } = useI18n()
const store = useAppStore()
useMeta(() => ({ title: t('settings.appearance.title') }))

// Computed
const locales = computed(() => availableLocales)
</script>