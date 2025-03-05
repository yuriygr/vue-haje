<template>
  <tags-list v-if="(!loading && !error) || data.length > 0">
    <tag-item-wrapper v-for="item in data" :key="`tag-item-${item.tag_id}`">
      <tag-item :data="item" />
    </tag-item-wrapper>

    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </tags-list>

  <template v-if="data.length == 0">
    <tags-list v-if="loading">
      <tag-item-wrapper v-for="_ in skeletons">
        <tag-item />
      </tag-item-wrapper>
    </tags-list>

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
import { Placeholder, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { TagsList, TagItem, TagItemWrapper } from '@/components/tag'

export default {
  name: 'search-tags',
  components: {
    TagsList, TagItem, TagItemWrapper,
    Placeholder, NButton, LoadmoreTrigger
  },
  computed: {
    ...mapState('app', [ 'skeletons' ]),
    ...mapState('search/tags', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('search/tags', [ 'hasMoreItems', 'emptyQuery', 'searching' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('search.title.tags')
      }
    }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('search/tags/more')
    }
  },
  async mounted() {
    await this.$store.dispatch('search/tags/setFilters', {
      query: this.$route.query.q, offset: undefined
    })
    this.$store.dispatch('search/tags/fetch')
  },
  unmounted() {
    this.$store.dispatch('search/tags/clear')
  },
  watch: {
    async '$route.query.q'(to) {
      await this.$store.dispatch('search/tags/setFilters', { query: to, offset: undefined })
      this.$store.dispatch('search/tags/fetch')
    }
  }
}
</script>

<style>

</style>