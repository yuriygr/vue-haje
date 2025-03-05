<template>
  <tabs>
    <template v-for="item in tabs" :key="`bookmarks-tab-${item.key}`">
      <tabs-item :to="item.to" :selected="item.key == $route.meta.key">{{ item.label }}</tabs-item>
    </template>
  </tabs>

  <spacer height="30" />

  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script>
import { Tabs, TabsItem, Spacer } from '@vue-norma/ui'

export default {
  name: 'bookmarks',
  components: {
    Tabs, TabsItem, Spacer
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('bookmarks.title')
      }
    }
  },
  computed: {
    tabs() {
      return Object.freeze([
        {
          key: 'all',
          to: this.formatLink(),
          label: this.$t('bookmarks.tabs.all')
        },
        {
          key: 'users',
          to: this.formatLink('users'),
          label: this.$t('bookmarks.tabs.users')
        },
        {
          key: 'entries',
          to: this.formatLink('entries'),
          label: this.$t('bookmarks.tabs.entries')
        },
        {
          key: 'feeds',
          to: this.formatLink('feeds'),
          label: this.$t('bookmarks.tabs.feeds')
        }
      ])
    },
    availableKeys() {
      return this.tabs.map(el => el.key)
    }
  },
  methods: {
    formatLink(tab = false) {
      let query = Object.assign({}, this.$route.query),
          q = query.q

      if (tab) {
        return { name: `bookmarks-${tab}`, query: { q }}
      } else {
        return { name: `bookmarks`, query: { q }}
      }
    }
  }
}
</script>

<style lang="scss">

</style>