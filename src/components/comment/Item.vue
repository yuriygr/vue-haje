<template>
  <div :class="[ 'comment' ]">
    <div class="comment__header">
      <user-item :data="data.user" :showSubscribeAction="false" mode="small" />
    </div>
    <div v-if="data.content.text" class="comment__content">
      {{ (data.content.text) }}
    </div>
    <meta-info class="comment__meta" :items="metaItems" />
  </div>
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
    }
  },
  data() {
    return {
      isPopoverActive: false
    }
  },
  computed: {
    metaItems() {
      let _result = []

      _result.push({ label: this.$tc('comment.meta.replies', this.data.counters.comments), to: this.commentLink })
      _result.push({ label: this.formatedDate, to: this.commentLink })
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