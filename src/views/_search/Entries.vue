<template>
  <entries-list v-if="(!loading && !error) || data.length > 0">
    <entry-item-wrapper v-for="item in data" :key="`entry-${item.uuid}`">
      <entry-item :data="item" type="short" />
    </entry-item-wrapper>

    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </entries-list>

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
import { EntriesList, EntryItem, EntryItemWrapper } from '@/components/entry'

export default {
  name: 'search-entries',
  components: {
    EntriesList, EntryItem, EntryItemWrapper,
    Placeholder, PlaceholderLoading, NButton, LoadmoreTrigger
  },
  computed: {
    ...mapState('search/entries', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('search/entries', [ 'hasMoreItems', 'emptyQuery', 'searching' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  data() {
    return { }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('search/entries/more')
    }
  },
  async mounted() {
    await this.$store.dispatch('search/entries/setFilters', {
      query: this.$route.query.q, offset: undefined
    })
    this.$store.dispatch('search/entries/fetch')
  },
  unmounted() {
    this.$store.dispatch('search/entries/clear')
  },
  watch: {
    async '$route.query.q'(to) {
      await this.$store.dispatch('search/entries/setFilters', { query: to, offset: undefined })
      this.$store.dispatch('search/entries/fetch')
    }
  }
}
</script>

<style>

</style>