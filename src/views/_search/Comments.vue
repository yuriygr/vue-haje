<template>
  <div class="comments-list" v-if="data.length > 0 || loading">
    <template v-if="data.length > 0">
      <comment-item-wrapper v-for="item in data" :key="`comment-${item.comment_id}`">
        <comment-item :data="item" replyButton="link" />
      </comment-item-wrapper>

      <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />
      <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
    </template>
   
    <template v-else-if="loading">
      <comment-item-wrapper v-for="index in 15" :key="`item-${index}`">
        <comment-item type="short" />
      </comment-item-wrapper>
    </template>
  </div>

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
import { CommentItem, CommentItemWrapper } from '@/components/comment'

export default {
  name: 'search-comments',
  components: {
    CommentItem, CommentItemWrapper,
    Placeholder, NButton, LoadmoreTrigger
  },
  computed: {
    ...mapState('search/comments', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('search/comments', [ 'hasMoreItems', 'emptyQuery', 'searching' ])
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('search.title.comments')
      }
    }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('search/comments/more')
    }
  },
  async mounted() {
    await this.$store.dispatch('search/comments/setFilters', {
      query: this.$route.query.q, offset: undefined
    })
    await this.$store.dispatch('search/comments/fetch')
  },
  beforeUnmount() {
    this.$store.dispatch('search/comments/clear')
  },
  watch: {
    async '$route.query.q'(to) {
      await this.$store.dispatch('search/comments/setFilters', { query: to, offset: undefined })
      await this.$store.dispatch('search/comments/fetch')
    }
  }
}
</script>