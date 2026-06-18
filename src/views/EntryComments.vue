<template>
  <div class="entry-comments" id="comments">
    <comment-reply :entry="entry.uuid" @success="onSuccessAddingComment" @error="onErrorAddingComment" />

    <div class="comments-tree" v-if="(!loading && !error) || data.length > 0">
      <template v-for="item in tree" :key="`comment-${item.comment_id}`">
        <comment-item :data="item" :entryAuthorID="entry.user.user_id" />
      </template>

      <div class="comments-tree__refresh-button">
        <n-button mode="secondary" @click.exact="loadMore" size="m" :disabled="loading" :badge="hasNew">{{ $t('action.refresh') }}</n-button>
      </div>
    </div>

    <template v-if="data.length == 0">
      <div class="comments-tree" v-if="loading">
        <comment-item v-for="index in 15" :key="`item-${index}`" />
      </div>
    </template>
  </div>
</template>

<script>
import { ref } from 'vue'
import { mapGetters, mapState } from 'vuex'
import { Group, Placeholder, Separator, NButton, ButtonsGroup, Spacer, NHeader } from '@vue-norma/ui'

import { CommentItem, CommentReply } from '@/components/comment'
import { useSSE } from '@/app/composables/useSSE'

export default {
  name: 'entry-comments',
  components: {
    Group, Placeholder, Separator, NButton, ButtonsGroup, Spacer, NHeader,
    CommentItem, CommentReply
  },
  props: {
    entry: {
      type: [ Object, Boolean ],
      default: false
    }
  },
  setup(props) {
    const hasNew = ref(false)

    const sse = useSSE(process.env.VUE_APP_SSE_ENDPOINT_ENTRY + '/' + props.entry.uuid)
    sse.on('has_replies', () => {
      hasNew.value = true
    })

    return { hasNew, sse }
  },
  computed: {
    ...mapState('entry/comments', [ 'data', 'loading', 'error' ]),
    ...mapGetters('entry/comments', [ 'tree' ]),
  },
  methods: {
    async onSuccessAddingComment(result) {
      await this.$store.dispatch('entry/comments/more', { uuid: this.entry.uuid })
      this.scrollToComment(result.payload.comment_id)
    },
    onErrorAddingComment(error) {
      this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
    },
    loadMore() {
      this.$store.dispatch('entry/comments/more', { uuid: this.entry.uuid })
      this.hasNew = false
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

          this.$bus.emit('comment.highlight', commentId)
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
  beforeUnmount() {
    this.$store.dispatch('entry/comments/clear')
  },
  watch: {
    uuid(to) {
      if (to != undefined) {
        this.$store.dispatch('entry/comments/clear')
      }
    },
    '$route.query.comment'(to) {
      if (to) this.scrollToComment(to)
    }
  }
}
</script>

<style lang="scss">
.entry-comments {
  margin-top: 2rem;
}
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

    @include on-tablet-device {
      bottom: 8px;
    }

    @include on-desktop-device {
      bottom: 8px;
    }
  }
}
</style>