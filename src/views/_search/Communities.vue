<template>
  <communities-list v-if="(!loading && !error) || data.length > 0">
    <community-item-wrapper v-for="item in data" :key="`community-${item.community_id}`">
      <community-item :data="item" />
    </community-item-wrapper>

    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </communities-list>

  <template v-if="data.length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else
      :icon="$t('errors.empty_search.icon')"
      :header="$t('errors.empty_search.title')"
      :text="$t('errors.empty_search.description')"
    />
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Placeholder, PlaceholderLoading, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { CommunitiesList, CommunityItem, CommunityItemWrapper } from '@/components/community'

export default {
  name: 'search-communities',
  components: {
    CommunitiesList, CommunityItem, CommunityItemWrapper,
    Placeholder, PlaceholderLoading, NButton, LoadmoreTrigger
  },
  computed: {
    ...mapState('search/communities', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('search/communities', [ 'hasMoreItems', 'emptyQuery', 'searching' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('search.title.communities')
      }
    }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('search/communities/more')
    }
  },
  async mounted() {
    await this.$store.dispatch('search/communities/setFilters', {
      query: this.$route.query.q, offset: undefined
    })
    this.$store.dispatch('search/communities/fetch')
  },
  unmounted() {
    this.$store.dispatch('search/communities/clear')
  },
  watch: {
    async '$route.query.q'(to) {
      await this.$store.dispatch('search/communities/setFilters', { query: to, offset: undefined })
      this.$store.dispatch('search/communities/fetch')
    }
  }
}
</script>

<style>

</style>