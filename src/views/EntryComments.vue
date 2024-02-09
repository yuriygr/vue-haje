<template>
  <div class="entry-comments">
    <comment-form :entry="entry.uuid" @success="onSuccessAddingComment" @error="onErrorAddingComment" />

    <div class="comments-tree" v-if="(!loading && !error) || data.length > 0">
      <template v-for="item in tree" :key="`comment-${item.comment_id}`">
        <comment-item :data="item" :index="1" />
      </template>
    </div>

    <template v-if="data.length == 0">
      <placeholder-loading v-if="loading" />
    </template>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { Group, Placeholder, PlaceholderLoading, Separator, NButton, ButtonsGroup, Spacer, NHeader, IconButton } from '@vue-norma/ui'

import { CommentItem, CommentItemWrapper, CommentForm } from '@/components/comment'

export default {
  name: 'entry-comments',
  components: {
    Group, Placeholder, PlaceholderLoading, Separator, NButton, ButtonsGroup, Spacer, NHeader, IconButton,
    CommentItem, CommentItemWrapper, CommentForm
  },
  props: {
    entry: {
      type: [ Object, Boolean ],
      default: false
    }
  },
  computed: {
    ...mapState('entry/comments', [ 'data', 'loading', 'error' ]),
    ...mapGetters('entry/comments', [ 'tree' ]),
    ...mapState('auth', {
      'session_data': state => state.data
    }),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: {
    onSuccessAddingComment(result) {
      this.entry.counters.comments += 1
      console.log(result)
      this.$alerts.success({ text: result.status })
    },
    onErrorAddingComment(error) {
      console.log(error)
      this.$alerts.danger({ text: error.status })
    },
  },
  mounted() {
    this.$store.dispatch('entry/comments/fetch', this.entry.uuid)
  },
  unmounted() {
    this.$store.dispatch('entry/comments/clear')
  },
}
</script>

<style lang="scss">
.comments-tree {
  margin-top: 2rem;
}
</style>