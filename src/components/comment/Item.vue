<template>
  <div :class="elClass">
    <div class="comment__branches">
      <template v-for="i in index - 1" :key="`comment-branch-${data.comment_id}-${i}`">
          <div class="branch" />
      </template>
    </div>
    <div class="comment__body">
      <div class="comment__header">
        <user-item :data="data.user" :showSubscribeAction="false" mode="small" />
      </div>
      <div v-if="data.content.text" class="comment__content" v-html="$filters.contentFormat(data.content.text)" />
      <meta-info class="comment__meta" :items="metaItems" />
    </div>
  </div>
  <template v-for="item in data.replies" :key="`comment-${item.comment_id}`">
    <comment-item :data="item" :index="index >= 4 ? index :index + 1"/>
  </template>
</template>

<script>
import { Icon, IconButton } from '@vue-norma/ui'

import { UserItem } from '@/components/user'

export default {
  name: 'comment-item',
  components: {
    UserItem,
    Icon, IconButton
  },
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      isPopoverActive: false
    }
  },
  computed: {
    elClass() {
      return [
        'comment',
        'comment--level-' + this.index
      ]
    },
    metaItems() {
      let _result = []

      _result.push({ label: this.$tc('comment.meta.reply'), action: () => { alert('hack') } })
      _result.push({ label: this.formatedDate })
      this.data.content.version > 1 && _result.push({ label: this.$t('comment.meta.edited') })

      return _result
    },
    commentLink() {
      return { name: 'entry', params: { uuid: this.data.uuid } }
    },
    optionsItems() {
      let _edit = [
        {
          icon: 'ui-pencil',
          label: this.$t('comment.action.edit'),
          action: this.edit
        },
        {
          icon: 'ui-delete',
          label: this.$t('comment.action.delete'),
          action: this.delete
        }
      ]

      return [
        {
          icon: 'ui-link',
          label: this.$t('comment.action.copy_link'),
          action: this.copyLink
        },
        ...(this.data.user.state.is_me) ? _edit : [
          {
            icon: 'ui-error-warning',
            label: this.$t('comment.action.report'),
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
    toggleOptions(e) {
      let target = typeof e == "object" ? e.currentTarget : this.$refs.options.$el
      this.$popover.open({
        items: this.optionsItems,
        target: target,
        align: 'right'
      })
    },
    copyLink() {
      let _url = this.$router.resolve(this.commentLink)
      navigator.clipboard.writeText(window.location.origin + _url.fullPath).then(_ => {
        this.$alerts.success({ text: this.$t('success.link_copied') })
      })
      this.$popover.close()
    },

    report() {
      this.$popover.close()
    },
    edit() {
      this.$popover.close()
    },
    delete() {
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

  --gap-branch: 2rem;
}


.comment {
  display: grid;
  grid-template-columns: auto 1fr;

  &__branches {
    display: flex;
    width: calc(var(--gap-branch) * (var(--level) - 1));

    .branch {
      width: var(--gap-branch, 0);
      border-left: 1px solid #222;
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      -ms-flex-negative: 0;
      flex-shrink: 0;
    }
  }

  &__body {
    padding: 1rem 0;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: .75rem;
  }

  &__content {
    font-size: 1.5rem;
    line-height: calc(1.4 * 1em);
    margin-bottom: .75rem;
  }

}
</style>