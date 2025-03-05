<template>
  <template v-if="data">
    <div :class="elClass" :id="`comment-${data.comment_id}`">
      <branches :count="level - 1" :key="data.comment_id" />
      <div class="comment__body">
        <div class="comment__header">
          <user-item :data="data.user" :showSubscribeAction="false" mode="small" />
          <div class="comment__author" v-if="entryAuthorID == data.user.user_id">{{ $t('comment.meta.author') }}</div>
        </div>
        <div v-if="data.content.text" class="comment__content" v-html="$filters.contentFormat(data.content.text)" />
        <attachments class="comment__attachments"  v-if="data.files || data.link" :files="data.files" :link="data.link" mode="compact" />
        <meta-info class="comment__meta" :items="metaItems" />
      </div>
    </div>
    <template v-for="item in data.replies" :key="`comment-${item.comment_id}`">
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
          <skeleton :width="240" :height="9" />
          <br />
          <skeleton :width="55" :height="8" /> <skeleton :width="70" :height="8" />
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { Icon, NButton } from '@vue-norma/ui'
import Attachments from '@/components/attachments'

import { UserItem } from '@/components/user'

let CommentEditModal = defineAsyncComponent(() => import("@/components/modals/_comment/Edit.vue"))
let CommentReportModal = defineAsyncComponent(() => import("@/components/modals/_comment/Report.vue"))
let CommentHistoryModal = defineAsyncComponent(() => import("@/components/modals/_comment/History.vue"))
let CommentDeleteModal = defineAsyncComponent(() => import("@/components/modals/_comment/Delete.vue"))

export default {
  name: 'comment-item',
  components: {
    UserItem, Attachments,
    Icon, NButton
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
    }
  },
  computed: {
    elClass() {
      return [
        'comment',
        'comment--level-' + this.level,
        { 'comment--highlighted': false } // TODO: Сделать
      ]
    },
    metaItems() {
      let _result = []

      this.replyButton == 'action' && _result.push({ label: this.$tc('comment.meta.reply'), action: this.toggleReplyForm })
      this.replyButton == 'link' && _result.push({ label: this.$tc('comment.meta.reply'), to: this.commentLink })

      _result.push({ label: this.formatedDate, to: this.commentLink })
      
      this.data.state.is_edited && _result.push({ label: this.$t('comment.meta.edited'), action: this.history })

      _result.push({ label: '⋯', action: this.toggleOptions, title: this.$t('action.options') })

      return _result
    },
    commentLink() {
      return { name: 'entry', params: { uuid: this.data.entry.uuid }, query: { comment: this.data.comment_id } }
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

      return [
        {
          icon: 'ui-link',
          label: this.$t('action.copy_link'),
          action: this.copyLink
        },
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
    toggleReplyForm() {
      this.isReply = !this.isReply
      this.$bus.emit('comment-form.reply', {
        level: this.level + 1,
        comment_id: this.data.comment_id
      })
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
    // Modals
    report() {
      this.$modals.show(CommentReportModal, {
        data: this.data
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
      this.$modals.show(CommentEditModal, {
        data: this.data,
        mode: 'edit'
      })
      this.$popover.close()
    },
    delete() {
      this.$modals.show(CommentDeleteModal, {
        data: this.data
      })
      this.$popover.close()
    }
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
  --comment__author--backgroud: var(--x-color-pink--tint10); 
  --comment__author--color: var(--x-color-pink--tint70); 

  html[data-theme="black"] & {
    --comment--background-highlighted: rgba(255, 255, 255, .03);
    --comment__author--backgroud: var(--x-color-pink--tint60); 
    --comment__author--color: var(--x-color-pink--shade50); 
  }
}

.comment {
  display: grid;
  grid-template-columns: auto 1fr;

  &--highlighted {
    --animation-duration: 1.2s;
    background-color: var(--comment--background-highlighted);
    animation: commentAttention var(--animation-duration) forwards ease-in-out;
  }

  &__body {
    padding: 1rem 0;
  }

  &__header {
    display: flex;
    justify-content: start;
    align-items: center;
    margin-bottom: .75rem;
  }

  &__author {
    margin-left: 1rem;
    font-size: 1.1rem;
    line-height: 1.6em;
    color: var(--comment__author--backgroud);
    background: var(--comment__author--color);
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

}

@keyframes commentAttention {
  0%, 50% { background-color: var(--comment--background-highlighted) }
  to { background-color: transparent }
}

</style>