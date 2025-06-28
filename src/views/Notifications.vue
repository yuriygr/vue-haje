<template>
  <buttons-group :withGap="true">
    <n-button mode="secondary" @click.exact="readAll" size="l" :stretched="true" :disabled="load_more_loading">{{ $t('notifications.action.read_all') }}</n-button>
    <n-button component="router-link" icon_before="settings-line" size="l" mode="secondary" :to="{ name: 'settings-notifications' }" :title="$t('notifications.action.settings')" />
  </buttons-group>
  
  <spacer height="15" />

  <tabs>
    <template v-for="item in tabs" :key="`notification-tab-${item.key}`">
      <tabs-item :to="item.to" :selected="item.key == filters.tab">{{ item.label }}</tabs-item>
    </template>
  </tabs>

  <spacer height="30" />

  <template v-if="(!loading && !error) || data.length > 0">
    <notification-item-wrapper v-for="item in data" :key="`notification-${item.notify_id}`">
      <notification-item :data="item" @click="readNotify" />
    </notification-item-wrapper>

    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </template>

  <template v-if="data.length == 0">
    <div class="notifications-list" v-if="loading">
      <notification-item-wrapper v-for="index in skeletons" :key="`item-${index}`">
        <notification-item />
      </notification-item-wrapper>
    </div>
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else
      :icon="$t('errors.empty_notifications.icon')"
      :header="$t('errors.empty_notifications.title')"
      :text="$t('errors.empty_notifications.description')"
    />
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Tabs, TabsItem, Placeholder, Separator, Spacer, NButton, LoadmoreTrigger, ButtonsGroup } from '@vue-norma/ui'

import { NotificationItem, NotificationItemWrapper } from '@/components/notifications'

export default {
  name: 'notifications',
  components: {
    NotificationItem, NotificationItemWrapper,
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
  computed: {
    ...mapState('app', [ 'skeletons' ]),
    ...mapState('notifications', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('notifications', [ 'hasMoreItems' ]),
    tabs() {
      return Object.freeze([
        { key: 'all', to: this.formatLink(), label: this.$t('notifications.tabs.all') },
        { key: 'subscription', to: this.formatLink('subscription'), label: this.$t('notifications.tabs.subscription') },
        { key: 'comment', to: this.formatLink('comment'), label: this.$t('notifications.tabs.comment') },
        { key: 'reply', to: this.formatLink('reply'), label: this.$t('notifications.tabs.reply') },
        { key: 'mention', to: this.formatLink('mention'), label: this.$t('notifications.tabs.mention') },
        { key: 'new_post', to: this.formatLink('new_post'), label: this.$t('notifications.tabs.new_post') },
        { key: 'system', to: this.formatLink('system'), label: this.$t('notifications.tabs.system') }
      ])
    },
    availableKeys() {
      return this.tabs.map(el => el.key)
    },
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: {
    formatLink(tab = false) {
      return tab 
        ? { name: this.$route.name, query: { tab } }
        : { name: this.$route.name }
    },
    seen() {
      this.$api.post('my/notifications/seen')
      .then(_ => {
        this.$store.dispatch('auth/seen_notifications')
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
    },
    readNotify(data) {
      if (!data.state.is_readed) {
        this.$store.dispatch('notifications/read', data.notify_id)
        this.$api.post(`my/notifications/${data.notify_id}/read`)
      }
    },
    readAll() {
      this.load_more_loading = true

      this.$api.post('my/notifications/read', { mode: 'all' })
      .then(result => {
        this.$store.dispatch('notifications/read_all')
        this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
      .then(_ => this.load_more_loading = false)
    },
    loadMore() {
      this.$store.dispatch('notifications/more')
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
    
    if (tab !== this.$route.query.tab) this.deleteTabQuery()
    
    await Promise.all([
      this.$store.dispatch('notifications/setFilters', { tab, offset: undefined }),
      this.$store.dispatch('notifications/fetch'),
      this.seen()
    ])
  },
  beforeUnmount() {
    this.$store.dispatch('notifications/clear')
  },
  watch: {
    '$route.query.tab': {
      async handler(to) {
        if (to) {
          const tab = this.availableKeys.includes(to) ? to : 'all'
          if (tab === this.filters.tab) return // Проверка на дубликаты
          
          await Promise.all([
            this.$store.dispatch('notifications/setFilters', { tab, offset: undefined }),
            this.$store.dispatch('notifications/fetch')
          ])
        }
      },
      // @TODO: Перенести логику инициализации сюда
      immediate: false 
    }
  }
}
</script>