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
    :icon="$t('bookmarks.empty.icon')"
    :header="$t('bookmarks.empty.title')"
    :text="$t('bookmarks.empty.description')"
  />
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Placeholder, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { CommentItem, CommentItemWrapper } from '@/components/comment'

export default {
  name: 'bookmarks-comments',
  components: {
    CommentItem, CommentItemWrapper,
    Placeholder, NButton, LoadmoreTrigger
  },
  computed: {
    ...mapState('bookmarks/comments', [ 'data', 'loading', 'error' ]),
    ...mapGetters('bookmarks/comments', [ 'hasMoreItems' ])
  },
  data() {
    return { }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('bookmarks/comments/more')
    }
  },
  mounted() {
    this.$store.dispatch('bookmarks/comments/fetch')
  },
  beforeUnmount() {
    this.$store.dispatch('bookmarks/comments/clear')
  },
  watch: {
    async '$route.query.q'(to) {
      await this.$store.dispatch('bookmarks/entries/setFilters', { offset: undefined })
      await this.$store.dispatch('bookmarks/entries/fetch')
    }
  }
}
</script>