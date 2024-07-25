<template>
  <template v-if="(!loading && !error) && Object.keys(data).length > 0">
    <user-card :data="data" />

    <spacer height="15" />

    <tabs>
      <template v-for="(item, index) in tabItems" :key="`user-tab-${item.key}-${index}`">
        <tabs-item :to="item.to" :selected="item.active">{{ item.label }}</tabs-item>
      </template>
    </tabs>

    <spacer height="30" />

    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </template>

  <template v-if="Object.keys(data).length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
  </template>
</template>

<script>
import { mapState } from 'vuex'
import { Placeholder, PlaceholderLoading, Separator, Spacer, Tabs, TabsItem } from '@vue-norma/ui'

import { UserCard } from '@/components/user'

export default {
  name: 'user',
  props: {
    username: {
      type: [ Boolean, String ],
      defalult: false
    }
  },
  components: {
    UserCard,
    Placeholder, PlaceholderLoading, Separator, Spacer, Tabs, TabsItem
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('user.title'),
      }
    }
  },
  computed: {
    ...mapState('user', [ 'data', 'loading', 'error' ]),
    tabItems() {
      return [
        {
          key: 'entries',
          to: { name: 'user' },
          label: this.$tc('user.tabs.entries', this.data.counters.entries),
          active: this.$route.name == `user-entries` || this.$route.name == `user` 
        },
        {
          key: 'subscribers',
          to: { name: 'user-subscribers' },
          label: this.$tc('user.tabs.subscribers', this.data.counters.subscribers),
          active: this.$route.name == `user-subscribers`
        },
        {
          key: 'subscriptions',
          to: { name: 'user-subscriptions' },
          label: this.$tc('user.tabs.subscriptions', this.data.counters.subscriptions),
          active: this.$route.name == `user-subscriptions`
        },
        {
          key: 'badges',
          to: { name: 'user-badges' },
          label: this.$tc('user.tabs.badges', this.data.counters.badges),
          active: this.$route.name == `user-badges`
        },
      ]
    },
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: {

  },
  mounted() {
    this.$store.dispatch('user/fetch', this.username)
  },
  unmounted() {
    this.$store.dispatch('user/clear')
  },
  watch: {
    'data'(to) {
      if (to)
        this.meta.title = `${to.profile?.name} (@${to.username})`
    },
    'error'(to) {
      if (to)
        this.meta.title = this.$t(this.humanizeError.title)
    },
    '$route.params.username'(to, from) {
      if (to != from) {
        this.$store.dispatch('user/fetch', to)
      }
    }
  }
}
</script>

<style lang="scss">

</style>