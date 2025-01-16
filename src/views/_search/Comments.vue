<template>
  <div class="comments-list" v-if="(!loading && !error) || data.length > 0">
    <comment-item-wrapper v-for="item in data" :key="`comment-${item.comment_id}`">
      <comment-item :data="item" replyButton="link" :index="1" />
    </comment-item-wrapper>

    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </div>

  <template v-if="data.length == 0">
    <div class="comments-list" v-if="loading">
      <comment-item-wrapper v-for="item in skeletons">
        <comment-item />
      </comment-item-wrapper>
    </div>
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
import { CommentItem, CommentItemWrapper } from '@/components/comment'

export default {
  name: 'search-comments',
  components: {
    CommentItem, CommentItemWrapper,
    Placeholder, NButton, LoadmoreTrigger
  },
  computed: {
    ...mapState('app', [ 'skeletons' ]),
    ...mapState('search/comments', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('search/comments', [ 'hasMoreItems', 'emptyQuery', 'searching' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
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
    this.$store.dispatch('search/comments/fetch')
  },
  unmounted() {
    this.$store.dispatch('search/comments/clear')
  },
  watch: {
    async '$route.query.q'(to) {
      await this.$store.dispatch('search/comments/setFilters', { query: to, offset: undefined })
      this.$store.dispatch('search/comments/fetch')
    }
  }
}
</script>

<style>

</style>