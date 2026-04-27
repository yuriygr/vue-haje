<template>
  <tags-list v-if="data.length > 0 || loading">
    <template v-if="data.length > 0">
      <tag-item-wrapper v-for="item in data" :key="`tag-item-${item.tag_id}`" v-memo="[item.tag_id]">
        <tag-item :data="item" />
      </tag-item-wrapper>

      <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />
      <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
    </template>
    
    <template v-else-if="loading">
      <tag-item-wrapper v-for="index in 15" :key="`item-${index}`">
        <tag-item />
      </tag-item-wrapper>
   </template>
  </tags-list>

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
import { Placeholder, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { TagsList, TagItem, TagItemWrapper } from '@/components/tag'

export default {
  name: 'search-tags',
  components: {
    TagsList, TagItem, TagItemWrapper,
    Placeholder, NButton, LoadmoreTrigger
  },
  computed: {
    ...mapState('search/tags', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('search/tags', [ 'hasMoreItems', 'emptyQuery', 'searching' ]),
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
    await this.$store.dispatch('search/tags/fetch')
  },
  beforeUnmount() {
    this.$store.dispatch('search/tags/clear')
  },
  watch: {
    async '$route.query.q'(to) {
      await this.$store.dispatch('search/tags/setFilters', { query: to, offset: undefined })
      await this.$store.dispatch('search/tags/fetch')
    }
  }
}
</script>