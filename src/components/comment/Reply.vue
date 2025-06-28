<template>
  <div :class="elClass">
    <branches :count="level - 1" />
    <comment-form mode="add" :entry="entry" :parent_id="parent_id" @success="onSuccess" @error="onError" @cancel="onCancel" />
  </div>
</template>

<script>
import { NButton, ButtonsGroup } from '@vue-norma/ui'

import { CommentForm } from '@/components/comment'

export default {
  name: 'comment-reply',
  components: {
    NButton, ButtonsGroup, CommentForm
  },
  props: {
    entry: {
      type: String
    },
    data: {
      type: [ Object, Boolean ],
      default: false
    },
  },
  emits: [ 'success', 'error' ],
  data() {
    return {
      originalParentNode: false,
      level: 1,
      parent_id: 0
    }
  },
  computed: {
    elClass() {
      return [
        'comment-reply',
        `comment-reply--level-${this.level}`
      ]
    }
  },
  methods: {
    onCancel() {
      if (this.originalParentNode) {
        this.originalParentNode.insertBefore(this.$el, this.originalParentNode.firstChild)
      }
      
      this.level = 1
      this.parent_id = 0
    },
    onSuccess(result) {
      this.$emit('success', result)
    },
    onError(result) {
      this.$emit('error', result)
    }
  },
  mounted() {
    this.$bus.on('comment-form.reply', (payload) => {
      if (!this.originalParentNode) {
        this.originalParentNode = this.$el.parentNode
      }

      let target_comment = document.getElementById(`comment-${payload.comment_id}`)
      target_comment.parentNode.insertBefore(this.$el, target_comment.nextSibling)

      this.level = payload.level
      this.parent_id = payload.comment_id
    })
  },
  beforeUnmount() {
    this.$bus.off('comment-form.reply')
  }
}
</script>

<style lang="scss">
.comment-reply {
  &--level-1 { --level: 1 }
  &--level-2 { --level: 2 }
  &--level-3 { --level: 3 }
  &--level-4 { --level: 4 }
  &--level-5 { --level: 5 }

  --gap-branch: 2rem;
  --avatar-size: 18px;
}

.comment-reply {
  display: grid;
  grid-template-columns: auto 1fr;
}

</style>