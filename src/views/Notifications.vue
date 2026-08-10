<template>
  <buttons-group :withGap="true">
    <n-button mode="secondary" @click.exact="readAll" size="l" :stretched="true" :disabled="readmore_loading">{{ t('notifications.action.read_all') }}</n-button>
    <n-button component="router-link" icon_before="settings-line" size="l" mode="secondary" :to="{ name: 'settings-notifications' }" :title="t('notifications.action.settings')" />
  </buttons-group>
  
  <spacer height="15" />

  <tabs>
    <template v-for="item in tabItems" :key="`notification-tab-${item.key}`">
      <tabs-item :to="item.to" :selected="item.key === filters.tab">{{ item.label }}</tabs-item>
    </template>
  </tabs>

  <spacer height="30" />

  <items-list type="notifications" v-if="data.length > 0 || loading" :has-data="data.length > 0" :loading="loading" :has-more="hasMoreItems" @more="loadMore">
    <notification-item v-for="item in data" :key="`notification-${item.notify_id}`" v-memo="[item.state.is_readed]" :data="item" />

    <template #skeleton>
      <notification-item v-for="index in 15" :key="`item-${index}`" />
    </template>
  </items-list>

  <placeholder v-else-if="error"
    :icon="humanizeError(error).icon"
    :header="humanizeError(error).title"
    :text="humanizeError(error).description"
  />
  <placeholder v-else
    :icon="t('notifications.empty.icon')"
    :header="t('notifications.empty.title')"
    :text="t('notifications.empty.description')"
  />
</template>

<script>
import { Tabs, TabsItem, Placeholder, Separator, Spacer, NButton, ButtonsGroup } from '@vue-norma/ui'

import { to } from '@/app/services/utilities'
import { NotificationItem } from '@/components/notifications'
import { useNotificationsStore } from '@/app/store/modules/notifications'
import { useAuthStore } from '@/app/store/modules/auth'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/app/composables/useToast'
import { useBus } from '@/app/composables/useBus'

export default {
  name: 'notifications',
  components: {
    Tabs, TabsItem, Placeholder, Separator, Spacer, NButton, ButtonsGroup,
    NotificationItem
  },
  setup() {
    const { t } = useI18n()
    const store = useNotificationsStore()
    const authStore = useAuthStore()
    const humanizeError = useHumanizeError()
    const toast = useToast()
    const bus = useBus()

    useMeta(() => ({ title: t('notifications.title') }))

    bus.on('app:has_notice', () => {
      store.loadNew()
    })

    return { t, toast, authStore, store, humanizeError, bus }
  },
  computed: {
    data()         { return this.store.data },
    filters()      { return this.store.filters },
    loading()      { return this.store.loading },
    error()        { return this.store.error },
    hasMoreItems() { return this.store.hasMoreItems },

    tabItems() {
      return [
        { 
          key: 'all',
          to: this.formatLink(),
          label: this.t('notifications.tabs.all')
        },
        { 
          key: 'subscription',
          to: this.formatLink('subscription'),
          label: this.t('notifications.tabs.subscriptions')
        },
        { 
          key: 'comment',
          to: this.formatLink('comment'),
          label: this.t('notifications.tabs.comments')
        },
        { 
          key: 'reply',
          to: this.formatLink('reply'),
          label: this.t('notifications.tabs.replies')
        },
        { 
          key: 'mention',
          to: this.formatLink('mention'),
          label: this.t('notifications.tabs.mentions')
        },
        { 
          key: 'new_post',
          to: this.formatLink('new_post'),
          label: this.t('notifications.tabs.new_post')
        },
        { 
          key: 'system',
          to: this.formatLink('system'),
          label: this.t('notifications.tabs.system')
        }
      ]
    },
    availableKeys() {
      return this.tabItems.map(el => el.key)
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
        ? this.toast.danger(this.t(`alerts.${error.status}`))
        : this.authStore.seenNotifications()
    },

    async readAll() {
      this.readmore_loading = true

      const [error, result] = await to(this.store.readAll())
      error
        ? this.toast.danger(this.t(`alerts.${error.status}`))
        : this.toast.success(this.t(`alerts.${result.status}`))

      this.readmore_loading = false
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
  mounted() {
    this.seen()

    const tab = this.availableKeys.includes(this.$route.query.tab) 
      ? this.$route.query.tab 
      : 'all'
    
    this.store.setFilters({ tab, offset: undefined })
    this.store.fetch()
  },
  beforeUnmount() {
    this.bus.off('app:has_notice')
    this.store.clear()
  },
  watch: {
    '$route.query.tab': {
      handler(to) {
        const tab = this.availableKeys.includes(to) ? to : 'all'
        if (tab === this.filters.tab) return // Проверка на дубликаты
        
        this.store.setFilters({ tab, offset: undefined })
        this.store.fetch()
      },
      immediate: false 
    }
  }
}
</script>