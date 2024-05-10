<template>
  <communities-list v-if="(!loading && !error) || data.length > 0">
    <community-item-wrapper v-for="item in data" :key="`community-${item.community_id}`">
      <community-item :data="item" type="short" />
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
      :icon="$t('errors.empty_bookmarks.icon')"
      :header="$t('errors.empty_bookmarks.title')"
      :text="$t('errors.empty_bookmarks.description')"
    />
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Placeholder, PlaceholderLoading, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { CommunitiesList, CommunityItem, CommunityItemWrapper } from '@/components/community'

export default {
  name: 'bookmarks-communities',
  components: {
    CommunitiesList, CommunityItem, CommunityItemWrapper,
    Placeholder, PlaceholderLoading, NButton, LoadmoreTrigger
  },
  computed: {
    ...mapState('bookmarks/communities', [ 'data', 'loading', 'error' ]),
    ...mapGetters('bookmarks/communities', [ 'hasMoreItems' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  data() {
    return { }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('bookmarks/communities/more')
    }
  },
  mounted() {
    this.$store.dispatch('bookmarks/communities/fetch')
  },
  unmounted() {
    this.$store.dispatch('bookmarks/communities/clear')
  },
  watch: {
    async '$route.query.q'(to) {
      await this.$store.dispatch('bookmarks/communities/setFilters', { offset: undefined })
      this.$store.dispatch('bookmarks/communities/fetch')
    }
  }
}
</script>

<style>

</style>