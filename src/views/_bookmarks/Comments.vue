<template>
  <group v-if="(!loading && !error) || data.length > 0">
    <div class="comments-list">
      <comment-item-wrapper v-for="item in data" :key="`comment-${item.comment_id}`">
        <comment-item :data="item" replyButton="link" />
      </comment-item-wrapper>

      <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

      <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
    </div>
  </group>

  <template v-if="data.length == 0">
    <div class="comments-list" v-if="loading">
      <comment-item-wrapper v-for="index in skeletons" :key="`item-${index}`">
        <comment-item />
      </comment-item-wrapper>
    </div>
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
import { CommentItem, CommentItemWrapper } from '@/components/comment'

export default {
  name: 'bookmarks-comments',
  components: {
    CommentItem, CommentItemWrapper,
    Group, Placeholder, NButton, LoadmoreTrigger
  },
  computed: {
    ...mapState('app', [ 'skeletons' ]),
    ...mapState('bookmarks/comments', [ 'data', 'loading', 'error' ]),
    ...mapGetters('bookmarks/comments', [ 'hasMoreItems' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
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
      this.$store.dispatch('bookmarks/entries/fetch')
    }
  }
}
</script>

<style>

</style>