<template>
  <tabs>
    <template v-for="(item, index) in tabs" :key="`feeds-tab-${item.key}-${index}`">
      <tabs-item :to="item.to" :selected="item.key == filters.tab" :disabled="item.disabled">{{ item.label }}</tabs-item>
    </template>
  </tabs>

  <spacer height="30" />

  <div class="search-form">
    <div class="search-form__field">
      <text-field
        icon="search-line"
        size="m"
        :modelValue="query"
        :placeholder="$t('search.search-field.placeholder')"

        @keyup.enter="changeInput($event.target.value)"
      />
    </div>
  </div>
  
  <spacer height="15" />

  <feeds-list v-if="(!loading && !error) || data.length > 0">
    <feed-item-wrapper v-for="item in data" :key="`feed-${item.feed_id}`">
      <feed-item :data="item" type="short" />
    </feed-item-wrapper>

    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </feeds-list>

  <template v-if="data.length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else
      :icon="$t('errors.empty_feeds.icon')"
      :header="$t('errors.empty_feeds.title')"
      :text="$t('errors.empty_feeds.description')"
    />
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Tabs, TabsItem, Separator, Spacer, Placeholder, PlaceholderLoading } from '@vue-norma/ui'
import { FeedsList, FeedItem, FeedItemWrapper } from '@/components/feed'

export default {
  name: 'feeds',
  components: {
    Tabs, TabsItem, Separator, Spacer, Placeholder, PlaceholderLoading,
    FeedsList, FeedItem, FeedItemWrapper
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('feeds.title')
      }
    }
  },
  computed: {
    ...mapState('feeds', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('feeds', [ 'hasMoreItems' ]),
    query() {
      return this.$route.query.q
    },
    tabs() {
      return [
        {
          key: 'subscribed',
          to: this.formatLink(),
          label: this.$t('feeds.tabs.subscribed')
        },
        {
          key: 'manage',
          to: this.formatLink('manage'),
          label: this.$t('feeds.tabs.manage')
        }
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
    changeInput(query) {
      this.$router.replace({ name: this.$route.name, query: { ...this.$route.query, q: query } })
    },
    loadMore() {
      this.$store.dispatch('feeds/more')
    },
    deleteTabQuery() {
      let query = Object.assign({}, this.$route.query)
      delete query.tab
      this.$router.replace({ name: this.$route.name, query })
    },
  },
  async mounted() {
    await this.$store.dispatch('feeds/setFilters', {
      tab: this.availableKeys.includes(this.$route.query.tab)
            ? this.$route.query.tab
            : ( this.deleteTabQuery(), 'subscribed' ), offset: undefined
    })
    this.$store.dispatch('feeds/fetch')
  },
  unmounted() {
    this.$store.dispatch('feeds/clear')
  },
  watch: {
    async '$route.query.tab'(to) {
      await this.$store.dispatch('communities/setFilters', {
        tab: this.availableKeys.includes(to) ? to : 'subscribed', offset: undefined
      })
      this.$store.dispatch('feeds/fetch')
    }
  }
}
</script>

<style lang="scss">

</style>