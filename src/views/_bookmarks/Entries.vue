<template>
  <entries-list v-if="data.length > 0 || loading">
    <template v-if="data.length > 0">
      <entry-item-wrapper v-for="item in data" :key="`entry-${item.uuid}`" v-memo="[item.uuid]">
        <entry-item :data="item" type="short" />
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
    :icon="$t('bookmarks.empty.icon')"
    :header="$t('bookmarks.empty.title')"
    :text="$t('bookmarks.empty.description')"
  />
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Placeholder, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { EntriesList, EntryItem, EntryItemWrapper } from '@/components/entry'

export default {
  name: 'bookmarks-entries',
  components: {
    EntriesList, EntryItem, EntryItemWrapper,
    Placeholder, NButton, LoadmoreTrigger
  },
  computed: {
    ...mapState('bookmarks/entries', [ 'data', 'loading', 'error' ]),
    ...mapGetters('bookmarks/entries', [ 'hasMoreItems' ])
  },
  data() {
    return { }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('bookmarks/entries/more')
    }
  },
  mounted() {
    this.$store.dispatch('bookmarks/entries/fetch')
  },
  beforeUnmount() {
    this.$store.dispatch('bookmarks/entries/clear')
  },
  watch: {
    async '$route.query.q'(to) {
      await this.$store.dispatch('bookmarks/entries/setFilters', { offset: undefined })
      await this.$store.dispatch('bookmarks/entries/fetch')
    }
  }
}
</script>