<template>
  <article :class="[ 'entry' ]">
    <div class="entry__header">
      <user-item :data="data.user" :showSubscribeAction="false" />
      <buttons-group class="entry__actions">
        <icon-button name="ui-more" mode="tertiary" @click.exact="toggleOptions" ref="options" :title="$t('action.options')" />
      </buttons-group>
    </div>
    <div v-if="data.content.text" class="entry__content" v-html="$filters.contentFormat(data.content.text)" />
    <meta-info class="entry__meta" :items="metaItems" />
  </article>
</template>

<script>
import { Icon, IconButton, ButtonsGroup } from '@vue-norma/ui'

import ReportEntryModal from '@/components/modals/ReportEntry'
import EditEntryModal from '@/components/modals/EditEntry'
import DeleteEntryModal from '@/components/modals/DeleteEntry'

import { UserItem } from '@/components/user'

export default {
  name: 'entry-item',
  components: {
    UserItem,
    Icon, IconButton, ButtonsGroup
  },
  props: {
    data: {
      type: Object
    },
    type: {
      type: String,
      default: 'short'
    },
    showPinAction: {
      type: Boolean,
      default: false
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

      this.data.state.is_comments_enabled && _result.push({ label: this.$tc('entry.meta.comments', this.data.counters.comments), to: this.commentsLink })
      _result.push({ label: this.formatedDate, to: this.entryLink })
      this.data.content.version > 1 && _result.push({ label: this.$t('entry.meta.edited') })

      return _result
    },
    commentsLink() {
      return { name: 'entry', params: { uuid: this.data.uuid } }
    },
    entryLink() {
      return { name: 'entry', params: { uuid: this.data.uuid } }
    },
    optionsItems() {
      let _subscribe = [
        this.data.user.state.me_subscribed ? 
        {
          icon: 'user-unfollow-line',
          label: this.$t('entry.action.unsubscribe'),
          action: this.unsubscribe
        } : {
          icon: 'user-add-line',
          label: this.$t('entry.action.subscribe'),
          action: this.subscribe
        }
      ]

      let _edit = [
        {
          icon: 'ui-pencil',
          label: this.$t('entry.action.edit'),
          action: this.edit
        },
        {
          icon: 'ui-delete',
          label: this.$t('entry.action.delete'),
          action: this.delete
        }
      ]

      let _bookmark = [
        this.data.state.is_bookmarked ?
        {
          icon: 'ui-bookmark-remove',
          label: this.$t('entry.action.remove-bookmark'),
          disabled: true
        } : {
          icon: 'ui-bookmark-add',
          label: this.$t('entry.action.add-bookmark'),
          disabled: true
        }
      ]

      let _pin = [
        this.data.state.is_pinned ?
        {
          icon: 'ui-unpin',
          label: this.$t('entry.action.unpin'),
          action: this.unpin
        } : {
          icon: 'ui-pushpin',
          label: this.$t('entry.action.pin'),
          action: this.pin
        }
      ]

      return [
        ...(this.data.user.state.is_me) ? [] : _subscribe,
        ...(this.data.user.state.is_me) ? [] : _bookmark,
        {
          icon: 'ui-link',
          label: this.$t('entry.action.copy_link'),
          action: this.copyLink
        },
        ...(this.data.user.state.is_me && this.showPinAction) ? _pin : [],
        ...(this.data.user.state.is_me) ? _edit : [
          {
            icon: 'ui-error-warning',
            label: this.$t('entry.action.report'),
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
    unsubscribe() {
      this.$api.post(`user/${this.data.user.username}/unsubscribe`)
      .then(result => {
        this.data.user.state.me_subscribed = !(result.status == 'unsubscribed')
        this.$popover.close()
      })
      .catch(error => {
        this.$alerts.danger({ text: error.status })
      })
    },
    subscribe() {
      this.$api.post(`user/${this.data.user.username}/subscribe`)
      .then(result => {
        this.data.user.state.me_subscribed = (result.status == 'subscribed')
        this.$popover.close()
      })
      .catch(error => {
        this.$alerts.danger({ text: error.status })
      })
    },
    copyLink() {
      let _url = this.$router.resolve(this.entryLink)
      navigator.clipboard.writeText(window.location.origin + _url.fullPath).then(_ => {
        this.$alerts.success({ text: this.$t('success.link_copied') })
      })
      this.$popover.close()
    },
    pin() {
      this.$api.post(`entry/${this.data.uuid}/pin`)
      .then(result => {
        this.data.state.is_pinned = (result.status == 'pinned')
        this.$popover.close()
      })
      .catch(error => {
        this.$alerts.danger({ text: error.status })
      })
    },
    unpin() {
      this.$api.post(`entry/${this.data.uuid}/unpin`)
      .then(result => {
        this.data.state.is_pinned = !(result.status == 'unpinned')
        this.$popover.close()
      })
      .catch(error => {
        this.$alerts.danger({ text: error.status })
      })
    },
    report() {
      this.$modals.show(ReportEntryModal, {
        data: this.data
      })
      this.$popover.close()
    },
    edit() {
      this.$modals.show(EditEntryModal, {
        data: this.data
      })
      this.$popover.close()
    },
    delete() {
      this.$modals.show(DeleteEntryModal, {
        data: this.data
      })
      this.$popover.close()
    }
  }
}
</script>

<style lang="scss">
.entry {
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