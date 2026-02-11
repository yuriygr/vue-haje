<template>
  <tabs>
    <template v-for="item in tabs" :key="`feed-tab-${item.key}`">
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
import { mapState } from 'vuex'
import { Spacer, Tabs, TabsItem } from '@vue-norma/ui'

export default {
  name: 'feed',
  components: {
    Spacer, Tabs, TabsItem
  },
  data() {
    return { }
  },
  computed: {
    ...mapState('app', ['cachedComponents']),
    tabs() {
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
          label: this.$t('feed.tabs.list'),
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
      this.$store.commit('app/RESET_CACHED_COMPONENTS')
    }
  },
}
</script>