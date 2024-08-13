<template>
  <tabs>
    <template v-for="(item, index) in tabs" :key="`bookmarks-tab-${item.key}-${index}`">
      <tabs-item :to="item.to" :selected="item.active" :disabled="item.disabled">{{ item.label }}</tabs-item>
    </template>
  </tabs>

  <spacer height="30" />

  <router-view />
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
      return [
        {
          key: 'all',
          to: this.formatLink(),
          label: this.$t('bookmarks.tabs.all'),
          active: this.$route.meta.key == `all` 
        },
        {
          key: 'users',
          to: this.formatLink('users'),
          label: this.$t('bookmarks.tabs.users'),
          active: this.$route.meta.key == `users`
        },
        {
          key: 'entries',
          to: this.formatLink('entries'),
          label: this.$t('bookmarks.tabs.entries'),
          active: this.$route.meta.key == `entries`
        },
        {
          key: 'communities',
          to: this.formatLink('communities'),
          label: this.$t('bookmarks.tabs.communities'),
          active: this.$route.meta.key == `communities`
        }
      ]
    },
    availableKeys() {
      return this.tabs.flatMap(el => el.key)
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