<template>
  <div class="entry-comments" id="comments">
    <comment-form :entry="entry.uuid" @success="onSuccessAddingComment" @error="onErrorAddingComment" />

    <div class="comments-tree" v-if="(!loading && !error) || data.length > 0">
      <template v-for="item in tree" :key="`comment-${item.comment_id}`">
        <comment-item :data="item" :entryAuthorID="entry.user.user_id" />
      </template>

      <div class="comments-tree__refresh-button">
        <n-button mode="secondary" @click.exact="loadMore" size="m" :disabled="loading">{{ $t('action.refresh') }}</n-button>
      </div>
    </div>

    <template v-if="data.length == 0">
      <div class="comments-list" v-if="loading">
        <comment-item-wrapper v-for="_ in skeletons">
          <comment-item />
        </comment-item-wrapper>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { Group, Placeholder, Separator, NButton, ButtonsGroup, Spacer, NHeader } from '@vue-norma/ui'

import { CommentItem, CommentItemWrapper, CommentForm } from '@/components/comment'

export default {
  name: 'entry-comments',
  components: {
    Group, Placeholder, Separator, NButton, ButtonsGroup, Spacer, NHeader,
    CommentItem, CommentItemWrapper, CommentForm
  },
  props: {
    entry: {
      type: [ Object, Boolean ],
      default: false
    }
  },
  computed: {
    ...mapState('app', [ 'skeletons' ]),
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
    async onSuccessAddingComment(result) {
      await this.$store.dispatch('entry/comments/more', { uuid: this.entry.uuid })
      this.scrollToComment(result.payload.comment_id)
    },
    onErrorAddingComment(error) {
      this.$alerts.danger({ text: this.$t(`errors.${error.status}`) })
    },
    loadMore() {
      this.$store.dispatch('entry/comments/more', { uuid: this.entry.uuid })
    },
    scrollToComment(commentId = false) {
      if (!commentId) return

      this.$nextTick(() => {
        const element = document.getElementById(`comment-${commentId}`)
        if (element) {
          const yOffset = -90 
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset
          
          window.scrollTo({
            top: y,
            behavior: 'instant'
          })
        }
      })
    }
  },
  mounted() {
    this.$store.dispatch('entry/comments/fetch', { uuid: this.entry.uuid })
    .then(_ => {
      this.scrollToComment(this.$route.query.comment)
    })
  },
  unmounted() {
    this.$store.dispatch('entry/comments/clear')
  },
  watch: {
    '$route.query.comment'(to) {
      if (to) this.scrollToComment(to)
    }
  }
}
</script>

<style lang="scss">
.comments-tree {
  margin: 2rem 0 0;

  &__refresh-button {
    height: 0;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: sticky;
    margin: 5rem 10px 0;
    z-index: 1;

    @include on-mobile-device {
      bottom: calc(var(--tabbar--height) + 8px);
    }

    @include on-desktop-device {
      bottom: 8px;
    }

    .button {
    }
  }
}
</style>