<template>
  <div
    class="about"
    @contextmenu="$event.preventDefault()"
    @dragstart="$event.preventDefault()"
    @drop="$event.preventDefault()"
  >
    <img class="about__logo" src="@/assets/logo.png" />
    <n-header class="about__title">{{ appTitle }}</n-header>
    <meta-info class="about__version" :items="metaItems" />
  </div>
  <separator />
  <navigation-section>
    <template v-for="(item, index) in helpItems" :key="`section-about-item-${index}`">
      <navigation-item :to="item.to" :chevron="item.chevron" :disabled="item.disabled">
        {{ item.label }}
      </navigation-item>
    </template>
  </navigation-section>
  <navigation-footer>
    <a href="#" @click.prevent="refresh">{{ $t('about.refresh') }}</a>
  </navigation-footer>
</template>

<script setup>
// Imports
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NHeader, Separator, NavigationSection, NavigationItem, NavigationFooter, MetaInfo } from '@vue-norma/ui'
import { storeToRefs } from 'pinia'

import { useAppStore } from '@/app/store/modules/app'
import { useMeta } from '@/app/composables/useMeta'

// Composables
const { t } = useI18n()
const store = useAppStore()
const { title: appTitle, version: appVersion } = storeToRefs(store)

useMeta(() => ({ title: t('about.title') }))

// Methods
const refresh = () => window.location.reload()

// Computed
const metaItems = computed(() => [
  { label: t('app.version', { version: appVersion.value }) }
])

const helpItems = computed(() => [
  { label: t('about.item.user-agreement'), to: { name: 'help-page', params: { slug: 'user-agreement' } }, chevron: true },
  { label: t('about.item.privacy'),        to: { name: 'help-page', params: { slug: 'privacy' } },        chevron: true },
  { label: t('about.item.legal'),          to: { name: 'help-page', params: { slug: 'legal' } },          chevron: true },
  { label: t('about.item.data-security'),  to: { name: 'help-page', params: { slug: 'data-security' } },  chevron: true },
  { label: t('about.item.architecture'),   to: { name: 'help-page', params: { slug: 'architecture' } },   chevron: true },
  { label: t('about.item.ai-usage'),       to: { name: 'help-page', params: { slug: 'ai-usage' } },       chevron: true },
  { label: t('about.item.rules'),          to: { name: 'help-page', params: { slug: 'rules' } },          chevron: true },
])
</script>

<style lang="scss">
$logo-size: 100px;

.about {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
  user-select: none;

  &__logo {
    box-shadow: var(--x-box-shadow--depth-4);
    width: $logo-size;
    height: $logo-size;
    border-radius: 25px;
    margin-bottom: 1rem;
  }

  &__title {
    margin-bottom: .5rem;
  }
}
</style>