<template>
  <tabs>
    <template v-for="item in tab_items" :key="`feed-tab-${item.key}`">
      <tabs-item :to="item.to" :selected="item.key == $route.meta.tab" :icon="item.icon">{{ item.label }}</tabs-item>
    </template>
  </tabs>

  <spacer height="30" />

  <router-view v-slot="{ Component, route }" name="feed">
    <keep-alive :include="cachedComponents">
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
  </router-view>
</template>

<script>
import { Spacer, Tabs, TabsItem } from '@vue-norma/ui'
import { useAppStore } from '@/app/store/modules/app'

export default {
  name: 'feed',
  components: {
    Spacer, Tabs, TabsItem
  },
  setup() {
    const appStore = useAppStore()
    return { appStore }
  },
  computed: {
    cachedComponents() { return this.appStore.cachedComponents },
    
    tab_items() {
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
  activated() {
    if (this.cachedComponents.length > 0) {
      this.appStore.resetCachedComponents()
    }
  },
}
</script>