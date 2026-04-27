<template>
  <buttons-group :withGap="true">
    <n-button mode="secondary" @click.exact="readAll" size="l" :stretched="true" :disabled="load_more_loading">{{ $t('notifications.action.read_all') }}</n-button>
    <n-button component="router-link" icon_before="settings-line" size="l" mode="secondary" :to="{ name: 'settings-notifications' }" :title="$t('notifications.action.settings')" />
  </buttons-group>
  
  <spacer height="15" />

  <tabs>
    <template v-for="item in tabs" :key="`notification-tab-${item.key}`">
      <tabs-item :to="item.to" :selected="item.key === filters.tab">{{ item.label }}</tabs-item>
    </template>
  </tabs>

  <spacer height="30" />

  <notifications-list v-if="data.length > 0 || loading">
    <template v-if="data.length > 0">
      <notification-item-wrapper v-for="item in data" :key="`notification-${item.notify_id}`" v-memo="[item.state.is_readed]">
        <notification-item :data="item"
          @click="read"
          @read="onRead"
          @hide="onHide"
        />
      </notification-item-wrapper>

      <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />
      <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
    </template>

    <template v-else-if="loading">
      <notification-item-wrapper v-for="index in 15" :key="`item-${index}`">
        <notification-item />
      </notification-item-wrapper>
    </template>
  </notifications-list>

  <placeholder v-else-if="error"
    :icon="$t($filters.humanizeError(error).icon)"
    :header="$t($filters.humanizeError(error).title)"
    :text="$t($filters.humanizeError(error).description)"
  />
  <placeholder v-else
    :icon="$t('notifications.empty.icon')"
    :header="$t('notifications.empty.title')"
    :text="$t('notifications.empty.description')"
  />
</template>

<script>
import { Tabs, TabsItem, Placeholder, Separator, Spacer, NButton, LoadmoreTrigger, ButtonsGroup } from '@vue-norma/ui'
import { to } from '@/app/services/utilities'

import { NotificationsList, NotificationItem, NotificationItemWrapper } from '@/components/notifications'
import { useNotificationsStore } from '@/app/components/stores/modules/notifications'

export default {
  name: 'notifications',
  components: {
    NotificationsList, NotificationItem, NotificationItemWrapper,
    Tabs, TabsItem, Placeholder, Separator, Spacer, NButton, LoadmoreTrigger, ButtonsGroup
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('notifications.title')
      },
      load_more_loading: false
    }
  },
  created() {
    this.store = useNotificationsStore()
  },
  computed: {
    data()         { return this.store.data },
    filters()      { return this.store.filters },
    loading()      { return this.store.loading },
    error()        { return this.store.error },
    hasMoreItems() { return this.store.hasMoreItems },
    tabs() {
      return [
        { 
          key: 'all',
          to: this.formatLink(),
          label: this.$t('notifications.tabs.all')
        },
        { 
          key: 'subscription',
          to: this.formatLink('subscription'),
          label: this.$t('notifications.tabs.subscriptions')
        },
        { 
          key: 'comment',
          to: this.formatLink('comment'),
          label: this.$t('notifications.tabs.comments')
        },
        { 
          key: 'reply',
          to: this.formatLink('reply'),
          label: this.$t('notifications.tabs.replies')
        },
        { 
          key: 'mention',
          to: this.formatLink('mention'),
          label: this.$t('notifications.tabs.mentions')
        },
        { 
          key: 'new_post',
          to: this.formatLink('new_post'),
          label: this.$t('notifications.tabs.new_post')
        },
        { 
          key: 'system',
          to: this.formatLink('system'),
          label: this.$t('notifications.tabs.system')
        }
      ]
    },
    availableKeys() {
      return this.tabs.map(el => el.key)
    }
  },
  methods: {
    formatLink(tab = false) {
      return tab 
        ? { name: this.$route.name, query: { tab } }
        : { name: this.$route.name }
    },
    async seen() {
      const [error] = await to(this.store.seen())
      error
        ? this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
        : this.$store.dispatch('auth/seen_notifications')
    },

    async read(notifyId) {
      const [error] = await to(this.store.read(notifyId))
      if (error) this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
    },

    async onRead(notifyId) {
      this.$popover.close()
      const [error, result] = await to(this.store.read(notifyId))
      error
        ? this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
        : this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })
    },

    async onHide(notifyId) {
      this.$popover.close()
      const [error, result] = await to(this.store.hide(notifyId))
      error
        ? this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
        : this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })
    },

    async readAll() {
      this.load_more_loading = true

      const [error, result] = await to(this.store.readAll())
      error
        ? this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
        : this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })

      this.load_more_loading = false
    },
    loadMore() {
      this.store.more()
    },
    deleteTabQuery() {
      let query = Object.assign({}, this.$route.query)
      delete query.tab
      this.$router.replace({ name: this.$route.name, query })
    },
  },
  async mounted() {
    const tab = this.availableKeys.includes(this.$route.query.tab) 
      ? this.$route.query.tab 
      : 'all'
    
    await this.store.setFilters({ tab, offset: undefined })
    await this.store.fetch()
    await this.seen()
  },
  beforeUnmount() {
    this.store.clear()
  },
  watch: {
    '$route.query.tab': {
      async handler(to) {
        const tab = this.availableKeys.includes(to) ? to : 'all'
        if (tab === this.filters.tab) return // Проверка на дубликаты
        
        await this.store.setFilters({ tab, offset: undefined })
        await this.store.fetch()
      },
      immediate: false 
    }
  }
}
</script>