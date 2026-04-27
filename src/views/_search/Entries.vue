<template>
  <entries-list v-if="data.length > 0 || loading">
    <template v-if="data.length > 0">
      <entry-item-wrapper v-for="item in data" :key="`entry-${item.uuid}`" v-memo="[item.uuid]">
        <entry-item :data="item" type="short" :showPinAction="false" />
      </entry-item-wrapper>

      <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />
      <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
    </template>
  
    <template v-else-if="loading">
      <entry-item-wrapper v-for="index in 15" :key="`item-${index}`">
        <entry-item type="short" />
      </entry-item-wrapper>
    </template>
  </entries-list>

  <placeholder v-else-if="error"
    :icon="$t($filters.humanizeError(error).icon)"
    :header="$t($filters.humanizeError(error).title)"
    :text="$t($filters.humanizeError(error).description)"
  />
  <placeholder v-else
    :icon="$t('search.empty.icon')"
    :header="$t('search.empty.title')"
    :text="$t('search.empty.description')"
  />
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
    ...mapGetters('search/entries', [ 'hasMoreItems', 'emptyQuery', 'searching' ])
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('search.title.entries')
      }
    }
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
    await this.$store.dispatch('search/entries/fetch')
  },
  beforeUnmount() {
    this.$store.dispatch('search/entries/clear')
  },
  watch: {
    async '$route.query.q'(to) {
      await this.$store.dispatch('search/entries/setFilters', { query: to, offset: undefined })
      await this.$store.dispatch('search/entries/fetch')
    }
  }
}
</script>