<template>
  <feeds-list v-if="data.length > 0 || loading">
    <template v-if="data.length > 0">
      <feed-item-wrapper v-for="item in data" :key="`feed-${item.feed_id}`" v-memo="[item.feed_id]">
        <feed-item :data="item" type="short" />
      </feed-item-wrapper>

      <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />
      <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
    </template>
    
    <template v-else-if="loading">
      <feed-item-wrapper v-for="index in 15" :key="`item-${index}`">
        <feed-item />
      </feed-item-wrapper>
    </template>
  </feeds-list>

  <placeholder v-else-if="error"
    :icon="$t($filters.humanizeError(error).icon)"
    :header="$t($filters.humanizeError(error).title)"
    :text="$t($filters.humanizeError(error).description)"
  />
  <placeholder v-else
    :icon="$t('errors.empty_feeds.icon')"
    :header="$t('errors.empty_feeds.title')"
    :text="$t('errors.empty_feeds.description')"
  />
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Placeholder, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { FeedsList, FeedItem, FeedItemWrapper } from '@/components/feed'

export default {
  name: 'feed-feeds',
  components: {
    FeedsList, FeedItem, FeedItemWrapper,
    Placeholder, NButton, LoadmoreTrigger
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
    ...mapGetters('feed/feeds', [ 'hasMoreItems' ])
  },
  methods: {
    loadMore() {
      this.$store.dispatch('feed/feeds/more')
    },
  },
  mounted() {
    this.$store.dispatch('feed/feeds/fetch')
  },
  beforeUnmount() {
    this.$store.dispatch('feed/feeds/clear')
  },
}
</script>
