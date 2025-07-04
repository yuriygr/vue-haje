<template>
  <group v-if="(!loading && !error) || data.length > 0">
    <entries-list>
      <entry-item-wrapper v-for="item in data" :key="`entry-${item.uuid}`">
        <entry-item :data="item" type="short" />
      </entry-item-wrapper>

      <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

      <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
    </entries-list>
  </group>

  <template v-if="data.length == 0">
    <entries-list v-if="loading">
      <entry-item-wrapper v-for="index in skeletons" :key="`item-${index}`">
        <entry-item type="short" />
      </entry-item-wrapper>
    </entries-list>
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
import { Group, Placeholder, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { EntriesList, EntryItem, EntryItemWrapper } from '@/components/entry'

export default {
  name: 'bookmarks-entries',
  components: {
    EntriesList, EntryItem, EntryItemWrapper,
    Group, Placeholder, NButton, LoadmoreTrigger
  },
  computed: {
    ...mapState('app', [ 'skeletons' ]),
    ...mapState('bookmarks/entries', [ 'data', 'loading', 'error' ]),
    ...mapGetters('bookmarks/entries', [ 'hasMoreItems' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
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
      this.$store.dispatch('bookmarks/entries/fetch')
    }
  }
}
</script>

<style>

</style>