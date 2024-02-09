<template>
  <buttons-group :withGap="true">
    <n-button mode="secondary" @click.exact="readAll" size="l" :stretched="true" :disabled="load_more_loading">{{ $t('notifications.action.read_all') }}</n-button>
    <icon-button component="router-link" name="settings-line" size="l" mode="secondary" :to="{ name: 'settings-notifications' }" :title="$t('notifications.action.settings')" />
  </buttons-group>
  
  <spacer height="15" />

  <tabs>
    <template v-for="(item, index) in tabs" :key="`notification-tab-${item.key}-${index}`">
      <tabs-item :to="item.to" :selected="item.key == filters.tab">{{ item.label }}</tabs-item>
    </template>
  </tabs>

  <separator />

  <template v-if="(!loading && !error) || data.length > 0">
    <notification-item-wrapper v-for="item in data" :key="`notification-${item.notify_id}`">
      <notification-item :data="item" />
    </notification-item-wrapper>

    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </template>

  <template v-if="data.length == 0">
    <placeholder-loading v-if="loading" />
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
import { Tabs, TabsItem, Placeholder, PlaceholderLoading, Separator, Spacer, IconButton, NButton, LoadmoreTrigger, ButtonsGroup } from '@vue-norma/ui'

import { NotificationItem, NotificationItemWrapper } from '@/components/notifications'

export default {
  name: 'notifications',
  components: {
    NotificationItem, NotificationItemWrapper,
    Tabs, TabsItem, Placeholder, PlaceholderLoading, Separator, Spacer, NButton, LoadmoreTrigger, IconButton, ButtonsGroup
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
    ...mapState('notifications', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('notifications', [ 'hasMoreItems' ]),
    tabs() {
      return [
        { key: 'all', to: this.formatLink(), label: this.$t('notifications.tabs.all') },
        { key: 'subscriptions', to: this.formatLink('subscriptions'), label: this.$t('notifications.tabs.subscriptions') },
        { key: 'replies', to: this.formatLink('replies'), label: this.$t('notifications.tabs.replies') },
        { key: 'mentions', to: this.formatLink('mentions'), label: this.$t('notifications.tabs.mentions') },
        { key: 'new_post', to: this.formatLink('new_post'), label: this.$t('notifications.tabs.new_post') },
        { key: 'system', to: this.formatLink('system'), label: this.$t('notifications.tabs.system') }
      ]
    },
    availableKeys() {
      return this.tabs.flatMap(el => el.key)
    },
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: {
    formatLink(tab = false) {
      if (tab) {
        return { name: this.$route.name, query: { tab }}
      } else {
        return { name: this.$route.name }
      }
    },
    readAll() {
      this.load_more_loading = true

      this.$api.post('my/notifications/read_all')
      .then(_ => {
        this.$alerts.success({ text: this.$t('notifications.alert.read_all_success') })
      })
      .catch(error => {
        this.$alerts.danger({ text: error.status })
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
    await this.$store.dispatch('notifications/setFilters', {
      tab: this.availableKeys.includes(this.$route.query.tab)
            ? this.$route.query.tab
            : ( this.deleteTabQuery(), 'all' ), offset: undefined
    })
    this.$store.dispatch('notifications/fetch')
  },
  unmounted() {
    this.$store.dispatch('notifications/clear')
  },
  watch: {
    async '$route.query.tab'(to) {
      await this.$store.dispatch('notifications/setFilters', {
        tab: this.availableKeys.includes(to) ? to : 'all', offset: undefined
      })
      this.$store.dispatch('notifications/fetch')
    }
  }
}
</script>