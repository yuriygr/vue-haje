<template>
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
import { NButton, NHeader, Group, Placeholder, PlaceholderLoading, LoadmoreTrigger } from '@vue-norma/ui'

import { FeedsList, FeedItem, FeedItemWrapper } from '@/components/feed'

export default {
  name: 'feed-feeds',
  components: {
    FeedsList, FeedItem, FeedItemWrapper,
    NButton, NHeader, Group, Placeholder, PlaceholderLoading, LoadmoreTrigger
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('feed.tabs.list')
      }
    }
  },
  computed: {
    ...mapState('feed/feeds', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('feed/feeds', [ 'hasMoreItems' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('feed/feeds/more')
    },
  },
  async mounted() {
    this.$store.dispatch('feed/feeds/fetch')
  },
  beforeUnmount() {
    this.$store.dispatch('feed/feeds/clear')
  },
}
</script>
