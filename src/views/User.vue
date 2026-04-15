<template>
  <template v-if="(!loading && !error) && Object.keys(data).length > 0">
    <user-card :data="data" />

    <spacer height="15" />

    <tabs>
      <template v-for="item in tabItems" :key="`user-tab-${item.key}`">
        <tabs-item :to="item.to" :selected="item.active">{{ item.label }}</tabs-item>
      </template>
    </tabs>

    <spacer height="30" />

    <router-view v-slot="{ Component }" name="user">
      <keep-alive>
        <component :is="Component" :username="username" />
      </keep-alive>
    </router-view>
  </template>

  <template v-if="Object.keys(data).length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t($filters.humanizeError(error).icon)"
      :header="$t($filters.humanizeError(error).title)"
      :text="$t($filters.humanizeError(error).description)"
    />
  </template>
</template>

<script>
import { Placeholder, PlaceholderLoading, Separator, Spacer, Tabs, TabsItem } from '@vue-norma/ui'

import { UserCard } from '@/components/user'
import { useUserStore } from '@/app/components/stores/modules/user'

export default {
  name: 'user',
  props: {
    username: {
      type: [ Boolean, String ],
      default: false
    }
  },
  components: {  UserCard, Placeholder, PlaceholderLoading, Separator, Spacer, Tabs, TabsItem },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('user.title'),
      }
    }
  },
  setup() {
    const store = useUserStore()
    return { store }
  },
  computed: {
    data()         { return this.store.data },
    loading()      { return this.store.loading },
    error()        { return this.store.error },
    isEmpty()      { return this.store.isEmpty },
    tabItems() {
      return [
        {
          key: 'entries',
          to: { name: 'user' },
          label: this.$t('user.tabs.entries', this.data.counters.entries),
          active: this.$route.name == `user-entries` || this.$route.name == `user` 
        },
        {
          key: 'subscribers',
          to: { name: 'user-subscribers' },
          label: this.$t('user.tabs.subscribers', this.data.counters.subscribers),
          active: this.$route.name == `user-subscribers`
        },
        {
          key: 'subscriptions',
          to: { name: 'user-subscriptions' },
          label: this.$t('user.tabs.subscriptions', this.data.counters.subscriptions),
          active: this.$route.name == `user-subscriptions`
        },
        {
          key: 'badges',
          to: { name: 'user-badges' },
          label: this.$t('user.tabs.badges', this.data.counters.badges),
          active: this.$route.name == `user-badges`
        },
      ]
    }
  },
  mounted() {
    this.store.fetch(this.username)
  },
  beforeUnmount() {
    this.store.clear()
  },
  watch: {
    username(to) {
      if (to) {
        this.store.clear()
        this.store.fetch(to)
      }
    },
    data: {
      handler(to) {
        if (to.profile?.name && to.username)
          this.meta.title = `${to.profile.name} (@${to.username})`
      },
      immediate: true
    },
    error(to) {
      if (to)
        this.meta.title = this.$t(this.$filters.humanizeError(this.error).title)
    }
  }
}
</script>