<template>
  <tabs v-if="isAuth">
    <template v-for="item in tabItems" :key="`feed-tab-${item.key}`">
      <tabs-item :to="item.to" :selected="item.key == $route.meta.tab" :icon="item.icon">{{ item.label }}</tabs-item>
    </template>
  </tabs>

  <div v-else class="about-alert">
    <span class="about-alert__label">*тут мотивирующий текст*</span>
    <n-button size="s" @click.exact="openAboutModal">{{ t('modals.about.readmore') }}</n-button>
  </div>

  <spacer height="30" />

  <router-view v-slot="{ Component, route }" name="feed">
    <keep-alive :include="cachedComponents">
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
  </router-view>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { Spacer, Tabs, TabsItem, NButton, useModals } from '@vue-norma/ui'

import { useAuthStore } from '@/app/store/modules/auth'
import { useAppStore } from '@/app/store/modules/app'
import { useI18n } from 'vue-i18n'

let AboutModal = defineAsyncComponent(() => import("@/modals/About.vue"))

export default {
  name: 'feed',
  components: {
    Spacer, Tabs, TabsItem, NButton
  },
  setup() {
    const { t } = useI18n()
    const appStore = useAppStore()
    const authStore = useAuthStore()
    const modals = useModals()

    return { t, appStore, authStore, modals }
  },
  computed: {
    isAuth() { return this.authStore.isAuth },
    cachedComponents() { return this.appStore.cachedComponents },
    
    tabItems() {
      return [
        {
          key: 'timeline',
          to: { name: 'feed-timeline' },
          label: this.$t('feed.tabs.timeline'),
          icon: false
        },
        {
          key: 'list',
          to: { name: 'feed-list' },
          label: this.$t('feed.tabs.feeds'),
          icon: 'spark-line'
        },
        {
          key: 'abyss',
          to: { name: 'feed-abyss' },
          label: this.$t('feed.tabs.abyss'),
          icon: false
        },
      ]
    }
  },
  methods: {
    openAboutModal(event) {
      this.modals.show(AboutModal)
    }
  },
  activated() {
    if (this.cachedComponents.length > 0) {
      this.appStore.resetCachedComponents()
    }
    if (!this.isAuth) this.$router.push({ name: 'feed-abyss' })

  },
  mounted() {
    if (!this.isAuth) this.$router.push({ name: 'feed-abyss' })
  }
}
</script>

<style lang="scss">
.about-alert {
  --about-alert--background: #fff;
  --about-alert--border-color: #f0f0f0;

  html[data-theme="black"] & {
    --about-alert--background: #181818;
    --about-alert--border-color: #1b1b1b;
  }
}

.about-alert {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 5rem;
  width: 100%;
  padding: 1rem;
  cursor: text;
  background: var(--about-alert--background);
  border: 1px solid var(--about-alert--border-color);
  border-radius: 8px;
  transition: var(--x-transition);
  box-shadow: var(--x-box-shadow--elevation-2);
  justify-content: space-between;

  &__label {
    white-space: nowrap;
    word-break: keep-all;
    font-size: 1.3rem;
    line-height: 1.2em;
    font-weight: 500;
  }
}
</style>