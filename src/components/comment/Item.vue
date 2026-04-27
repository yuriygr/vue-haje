<template>
  <template v-if="data">
    <div :class="elClass" :id="`comment-${data.comment_id}`">
      <branches :count="level - 1" />
      <div v-if="data.status == 1" class="comment__body">
        <comment-form v-if="isEdit" mode="edit"
          :data="data"
          @success="onEditSuccess"
          @error="onEditError"
          @cancel="onEditCancel"
        />
        <template v-else>
          <div class="comment__header">
            <user-item :data="data.user" :showSubscribeAction="false" mode="small" />
            <div class="comment__author" v-if="entryAuthorID == data.user.user_id">{{ $t('comment.meta.author') }}</div>
          </div>
          <div v-if="data.content.text" class="comment__content" v-linkified="data.content.text" />
          <attachments class="comment__attachments"  v-if="data.files || data.link" :files="data.files" :link="data.link" mode="compact" />
          <meta-info class="comment__meta" :items="metaItems" />
        </template>
      </div>
      <div v-else-if="data.status == 2" class="comment__deleted">
        <div class="deleted-item__icon">
          <icon name="cross-line" :size="8" />
        </div>
        <div class="deleted-item__label">{{ $t('comment.deleted', { reason: 0 }) }}</div>
      </div>
    </div>
    <template v-for="item in data.replies">
      <comment-item :data="item" :level="level >= maxBranchesLevel ? level : level + 1" :entryAuthorID="entryAuthorID" />
    </template>
  </template>

  <template v-else>
    <div :class="elClass">
      <div class="comment__body">
        <div class="comment__header">
          <user-item :showSubscribeAction="false" mode="small" />
        </div>
        <div class="comment__content">
          <skeleton :width="skeletonWidths.q" :height="9" />
          <br />
          <skeleton :width="skeletonWidths.w" :height="8" /> <skeleton :width="skeletonWidths.e" :height="8" />
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { Icon, NButton, MetaInfo } from '@vue-norma/ui'

import Attachments from '@/components/attachments'
import { UserItem } from '@/components/user'

const CommentForm = defineAsyncComponent(() => import("@/components/comment/Form.vue"))
const CommentReportModal = defineAsyncComponent(() => import("@/modals/_comment/Report.vue"))
const CommentHistoryModal = defineAsyncComponent(() => import("@/modals/_comment/History.vue"))
const CommentDeleteModal = defineAsyncComponent(() => import("@/modals/_comment/Delete.vue"))

export default {
  name: 'comment-item',
  components: {
    UserItem, Attachments, CommentForm,
    Icon, NButton, MetaInfo
  },
  props: {
    data: {
      type: Object
    },
    level: {
      type: Number,
      default: 1
    },
    mode: {
      type: String,
      default: 'normal',
      validator(value) {
        return ['normal', 'small'].includes(value)
      }
    },
    replyButton: {
      type: String,
      default: 'action',
      validator(value) {
        return ['action', 'link', 'none'].includes(value)
      }
    },
    entryAuthorID: {
      type: [ Boolean, Number ],
      default: 0
    },
    maxBranchesLevel: {
      type: Number,
      default: 6
    }
  },
  data() {
    return {
      isReply: false,
      isEdit: false,
      isHighlighted:false,

      loading: {
        stars: false,
        bookmarks: false
      },
      skeletonWidths: {
        q: Math.floor(Math.random() * 100) + 200,
        w: Math.floor(Math.random() * 100) + 40,
        e: Math.floor(Math.random() * 100) + 50
      }
    }
  },
  computed: {
    elClass() {
      return [
        'comment',
        'comment--level-' + this.level,
        { 'comment--highlighted': this.isHighlighted }
      ]
    },
    metaItems() {
      let _result = []

      this.replyButton == 'action' && _result.push({ label: this.$t('comment.meta.reply'), action: this.toggleReplyForm })
      this.replyButton == 'link' && _result.push({ label: this.$t('comment.meta.reply'), to: this.commentLink })

      _result.push({ label: this.formatedDate, to: this.commentLink })
      
      this.data.state.is_edited && _result.push({ label: this.$t('comment.meta.edited'), action: this.history })

      if (this.replyButton == 'action' && this.data.parent_id != 0) {
         _result.push({ label: '↑', to: this.parentLink, title: this.$t('comment.meta.parent') })
      }

      _result.push({ label: '⋯', action: this.toggleOptions, title: this.$t('action.options') })

      return _result
    },
    commentLink() {
      return { name: 'entry', params: { uuid: this.data.entry.uuid }, query: { comment: this.data.comment_id } }
    },
    parentLink() {
      return { name: 'entry', params: { uuid: this.data.entry.uuid }, query: { comment: this.data.parent_id } }
    },
    optionsItems() {
      let _edit = [
        {
          icon: 'ui-pencil',
          label: this.$t('action.edit'),
          action: this.edit
        },
        {
          icon: 'ui-delete',
          label: this.$t('action.delete'),
          action: this.delete
        }
      ]

      let _bookmark = [
        this.data.state.is_bookmarked ?
        {
          icon: 'ui-bookmark-remove',
          label: this.$t('action.remove-bookmark'),
          action: this.toggleBookmarks
        } : {
          icon: 'ui-bookmark-add',
          label: this.$t('action.add-bookmark'),
          action: this.toggleBookmarks
        }
      ]

      return [
        {
          icon: 'ui-link',
          label: this.$t('action.copy_link'),
          action: this.copyLink
        },
        ..._bookmark,
        ...(this.data.user.state.is_me) ? _edit : [
          {
            icon: 'ui-error-warning',
            label: this.$t('action.report'),
            action: this.report
          }
        ]
      ]
    },
    formatedDate() {
      return this.$filters.timeAgo(this.data.meta.date_added, this.$i18n.locale)
    }
  },
  methods: {
    onHighlight(commentId) {
      if (commentId != this.data.comment_id) return
      this.isHighlighted = true
      setTimeout(() => { this.isHighlighted = false }, 2000)
    },
    toggleReplyForm() {
      this.isReply = !this.isReply
      this.$bus.emit('comment-form.reply', {
        level: this.level + 1,
        comment_id: this.data.comment_id
      })
    },
    toggleBookmarks() {
      this.loading.bookmarks = true

      this.$api.post('my/bookmarks', {
        type: this.data.state.is_bookmarked ? 'remove' : 'add',
        object: 'comment',
        comment_id: this.data.comment_id
      })
      .then(result => {
        this.data.state.is_bookmarked = (result.status == 'added')

        this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })
        this.$popover.close()
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
      .then(_ =>  this.loading.bookmarks = false)
    },
    toggleOptions(e) {
      let target = typeof e == "object" ? e.currentTarget : this.$refs.options.$el
      this.$popover.open({
        items: this.optionsItems,
        target: target,
        align: 'left'
      })
    },
    copyLink() {
      let _url = this.$router.resolve(this.commentLink)
      navigator.clipboard.writeText(window.location.origin + _url.fullPath).then(_ => {
        this.$alerts.success({ text: this.$t('success.link_copied') })
      })
      this.$popover.close()
    },

    deleteComment() {
      return this.$api.delete(`comment/${this.data.comment_id}`)
      .then(result => {
        this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
    },

    reportComment(reason = 0) {
      return this.$api.post(`comment/${this.data.comment_id}/report`, { reason })
      .then(result => {
        this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
    },

    // Modals
    report() {
      this.$modals.show(CommentReportModal, {
        reportComment: this.reportComment
      })
      this.$popover.close()
    },
    history() {
      this.$modals.show(CommentHistoryModal, {
        id: this.data.comment_id
      })
      this.$popover.close()
    },
    edit() {
      this.isEdit = true
      this.$popover.close()
    },
    delete() {
      this.$modals.show(CommentDeleteModal, {
        deleteComment: this.deleteComment
      })
      this.$popover.close()
    },
    // Edit methods
    onEditSuccess(data) {
      this.isEdit = false
      this.$nextTick(() => {
        this.$store.dispatch('entry/comments/update_comment', {
          comment_id: data.payload.comment_id,
          value: data.payload
        })
      })
    },
    onEditError(error) {
      this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
    },
    onEditCancel() {
      this.isEdit = false
    }
  },
  mounted() {
    this.$bus.on('comment.highlight', this.onHighlight)
  },
  beforeUnmount() {
    this.$bus.off('comment.highlight', this.onHighlight)
  }
}
</script>

<style lang="scss">
.comment {
  &--level-1 { --level: 1 }
  &--level-2 { --level: 2 }
  &--level-3 { --level: 3 }
  &--level-4 { --level: 4 }
  &--level-5 { --level: 5 }
  &--level-6 { --level: 6 }
  &--level-7 { --level: 7 }

  --gap-branch: 2rem;
  --avatar-size: 18px;
}

.comment {
  --comment--background-highlighted: rgba(255, 255, 255, .03);
  --comment__author--background: var(--x-color-pink--tint70); 
  --comment__author--color: var(--x-color-pink--tint10); 

  --deleted-item__icon--background: #f5f5f5;
  --deleted-item__icon--color: #666;
  --deleted-item__label--color: #666;

  html[data-theme="black"] & {
    --comment--background-highlighted: rgba(255, 255, 255, 0.05);
    --comment__author--background: var(--x-color-pink--shade50); 
    --comment__author--color: var(--x-color-pink--tint60); 

    --deleted-item__icon--background: #161616;
    --deleted-item__icon--color: #919190;
    --deleted-item__label--color: #919190;
  }
}

.comment {
  display: grid;
  grid-template-columns: auto 1fr;

  &--highlighted {
    .comment__body {
      --animation-duration: 1.2s;
      background-color: var(--comment--background-highlighted);
      animation: commentAttention var(--animation-duration) forwards ease-in-out;
    }
  }

  &__body {
    padding: 1rem 0;
  }

  &__header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: .75rem;
  }

  &__author {
    margin-left: 1rem;
    font-size: 1.1rem;
    line-height: 1.6em;
    background: var(--comment__author--background);
    color: var(--comment__author--color);
    padding: 0 .3rem;
    border-radius: 4px;
    text-transform: lowercase;
  }

  &__content {
    color: var(--x-body--color);
    font-size: 1.5rem;
    line-height: calc(1.4 * 1em);
    margin-bottom: .75rem;
    word-break: break-word;
  }

  &__attachments {
    margin-bottom: 1rem;
  }

  
  &__deleted {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    position: relative;
    overflow: hidden;

    padding: 1rem 0;

    .deleted-item__icon {
      background: var(--deleted-item__icon--background);
      color: var(--deleted-item__icon--color);
      display: flex;
      justify-content: center;
      padding: 1.3rem;
      margin-right: 1rem;
      border-radius: 8px;

      svg {
        fill: currentColor;
        width: 1rem;
        height: 1rem;
        display: block;
      }
    }

    .deleted-item__label {
      color: var(--deleted-item__label--color);
      font-size: 1.4rem;
      line-height: calc(1.4 * 1em);
    }
  }

}

@keyframes commentAttention {
  0%, 50% { background-color: var(--comment--background-highlighted) }
  to { background-color: transparent }
}
</style>