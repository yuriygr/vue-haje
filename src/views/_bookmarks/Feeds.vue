<template>
  <group v-if="(!loading && !error) || data.length > 0">
    <feeds-list>
      <feed-item-wrapper v-for="item in data" :key="`feed-${item.feed_id}`">
        <feed-item :data="item" type="short" />
      </feed-item-wrapper>

      <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

      <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
    </feeds-list>
  </group>

  <template v-if="data.length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else
      :icon="$t('errors.empty_bookmarks.icon')"
      :header="$t('errors.empty_bookmarks.title')"
      :text="$t('errors.empty_bookmarks.description')"
    />
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Group, Placeholder, PlaceholderLoading, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { FeedsList, FeedItem, FeedItemWrapper } from '@/components/feed'

export default {
  name: 'bookmarks-feeds',
  components: {
    FeedsList, FeedItem, FeedItemWrapper,
    Group, Placeholder, PlaceholderLoading, NButton, LoadmoreTrigger
  },
  computed: {
    ...mapState('bookmarks/feeds', [ 'data', 'loading', 'error' ]),
    ...mapGetters('bookmarks/feeds', [ 'hasMoreItems' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
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
  unmounted() {
    this.$store.dispatch('bookmarks/feeds/clear')
  },
  watch: {
    async '$route.query.q'(to) {
      await this.$store.dispatch('bookmarks/feeds/setFilters', { offset: undefined })
      this.$store.dispatch('bookmarks/feeds/fetch')
    }
  }
}
</script>

<style>

</style>