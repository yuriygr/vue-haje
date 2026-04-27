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
      <feed-item-wrapper v-for="index in 5" :key="`item-${index}`">
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
    :icon="$t('bookmarks.empty.icon')"
    :header="$t('bookmarks.empty.title')"
    :text="$t('bookmarks.empty.description')"
  />
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Placeholder, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { FeedsList, FeedItem, FeedItemWrapper } from '@/components/feed'

export default {
  name: 'bookmarks-feeds',
  components: {
    FeedsList, FeedItem, FeedItemWrapper,
    Placeholder, NButton, LoadmoreTrigger
  },
  computed: {
    ...mapState('bookmarks/feeds', [ 'data', 'loading', 'error' ]),
    ...mapGetters('bookmarks/feeds', [ 'hasMoreItems' ])
  },
  data() {
    return { }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('bookmarks/feeds/more')
    }
  },
  mounted() {
    this.$store.dispatch('bookmarks/feeds/fetch')
  },
  beforeUnmount() {
    this.$store.dispatch('bookmarks/feeds/clear')
  },
  watch: {
    async '$route.query.q'(to) {
      await this.$store.dispatch('bookmarks/feeds/setFilters', { offset: undefined })
      await this.$store.dispatch('bookmarks/feeds/fetch')
    }
  }
}
</script>