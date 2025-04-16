<template>
  <tabs>
    <template v-for="item in tabs" :key="`feed-tab-${item.key}`">
      <tabs-item :to="item.to" :selected="item.key == $route.meta.tab" :icon="item.icon">{{ item.label }}</tabs-item>
    </template>
  </tabs>

  <spacer height="30" />

  <router-view />
</template>

<script>
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
  }
}
</script>