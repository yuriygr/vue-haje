<template>
  <template v-if="data">
    <div :class="[ 'entry' ]">
      <div class="entry__header">
        <user-item :data="data.user" :showSubscribeAction="false" />
        <buttons-group class="entry__options">
          <n-button icon_before="ui-eye-off" v-if="data.state.is_hidden_from_feed" mode="tertiary" disabled="true" :title="$t('entry.meta.hidden_from_feed')" />
          <n-button icon_before="ui-pushpin" v-if="showPinAction && data.state.is_pinned" mode="tertiary" disabled="true" :title="$t('entry.meta.pinned')" />
          <n-button icon_before="ui-more" mode="tertiary" @click.exact="toggleOptions" ref="options" :title="$t('action.options')" />
        </buttons-group>
      </div>
      <div v-if="data.content.text" class="entry__content" v-html="$filters.contentFormat(data.content.text)" />
      <attachments class="entry__attachments" v-if="data.files || data.link" :files="data.files" :link="data.link" mode="full" />
      <meta-info class="entry__meta" :items="metaItems" />
    </div>
  </template>
  
  <template v-else>
    <div :class="[ 'entry' ]">
      <div class="entry__header">
        <user-item :showSubscribeAction="false" />
        <buttons-group class="entry__options">
          <n-button icon_before="ui-more" mode="tertiary" :disabled="true" :title="$t('action.options')" />
        </buttons-group>
      </div>
      <div class="entry__content">
        <skeleton :width="240" :height="9" />
        <br />
        <skeleton :width="310" :height="9" />
        <br />
        <skeleton :width="80" :height="9" />
        <br />
        <skeleton :width="190" :height="9" />
        <br />
        <skeleton :width="55" :height="8" /> <skeleton :width="70" :height="8" />
      </div>
    </div>
  </template>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { Icon, NButton, ButtonsGroup, MetaInfo } from '@vue-norma/ui'

let ComposeModal = defineAsyncComponent(() => import("@/components/modals/Compose.vue"))

let EntryReportModal = defineAsyncComponent(() => import("@/components/modals/_entry/Report.vue"))
let EntryHistoryModal = defineAsyncComponent(() => import("@/components/modals/_entry/History.vue"))
let EntryDeleteModal = defineAsyncComponent(() => import("@/components/modals/_entry/Delete.vue"))

import { ActionItem } from '@/components/actions'
import { UserItem } from '@/components/user'
import Attachments from '@/components/attachments'

export default {
  name: 'entry-item',
  components: {
    UserItem, Attachments, ActionItem,
    Icon, NButton, ButtonsGroup, MetaInfo
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
      isPopoverActive: false,
      loading: {
        stars: false,
        bookmarks: false
      }
    }
  },
  computed: {
    metaItems() {
      let _result = []

      this.data.state.is_comments_enabled && _result.push({ label: this.$tc('entry.meta.comments', this.data.counters.comments), to: this.commentsLink })
      _result.push({ label: this.formatedDate, to: this.entryLink })
      this.data.state.is_edited && _result.push({ label: this.$t('entry.meta.edited'), action: this.history })

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
          label: this.$t('action.unsubscribe'),
          action: this.unsubscribe
        } : {
          icon: 'user-add-line',
          label: this.$t('action.subscribe'),
          action: this.subscribe
        }
      ]

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

      let _pin = [
        this.data.state.is_pinned ?
        {
          icon: 'ui-unpin',
          label: this.$t('entry.action.unpin'),
          action: this.togglePin
        } : {
          icon: 'ui-pushpin',
          label: this.$t('entry.action.pin'),
          action: this.togglePin
        }
      ]

      return [
        ...(this.data.user.state.is_me) ? [] : _subscribe,
        ..._bookmark,
        {
          icon: 'ui-link',
          label: this.$t('action.copy_link'),
          action: this.copyLink
        },
        ...(this.data.state.is_edited) ? [{
          icon: 'ui-history',
          label: this.$t('entry.action.history'),
          action: this.history
        }] : [],
        ...(this.data.user.state.is_me && this.showPinAction) ? _pin : [],
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
    toggleOptions(e) {
      let target = typeof e == "object" ? e.currentTarget : this.$refs.options.$el
      this.$popover.open({
        items: this.optionsItems,
        target: target,
        align: 'right'
      })
    },
    copyLink() {
      let _url = this.$router.resolve(this.entryLink)
      navigator.clipboard.writeText(window.location.origin + _url.fullPath).then(_ => {
        this.$alerts.success({ text: this.$t('success.link_copied') })
      })
      this.$popover.close()
    },
    // State togglers
    unsubscribe() {
      this.$api.post(`user/${this.data.user.username}/unsubscribe`)
      .then(result => {
        this.data.user.state.me_subscribed = !(result.status == 'unsubscribed')
        this.$popover.close()
      })
      .catch(error => this.$alerts.danger({ text: error.status }))
    },
    subscribe() {
      this.$api.post(`user/${this.data.user.username}/subscribe`)
      .then(result => {
        this.data.user.state.me_subscribed = (result.status == 'subscribed')
        this.$popover.close()
      })
      .catch(error => this.$alerts.danger({ text: error.status }))
    },

    toggleStar() {
      this.loading.stars = true
    },

    toggleBookmarks() {
      this.loading.bookmarks = true

      this.$api.post('my/bookmarks', {
        type: this.data.state.is_bookmarked ? 'remove' : 'add',
        object: 'entry',
        entry_id: this.data.entry_id
      })
      .then(result => {
        this.data.state.is_bookmarked = (result.status == 'added')

        result.status == 'added'
          ? this.data.counters.bookmarks++
          : this.data.counters.bookmarks--

        this.$alerts.success({ text: result.status })
        this.$popover.close()
      })
      .catch(error => this.$alerts.danger({ text: error.status }))
      .then(_ =>  this.loading.bookmarks = false)
    },
    togglePin() {
      let path = this.data.state.is_pinned
        ? `entry/${this.data.uuid}/unpin`
        : `entry/${this.data.uuid}/pin`
      this.$api.post(path)
      .then(result => {
        this.data.state.is_pinned = (result.status == 'pinned')
        this.$alerts.success({ text: result.status })
        this.$popover.close()
      })
      .catch(error => this.$alerts.danger({ text: error.status }))
    },
    // Modals
    report() {
      this.$modals.show(EntryReportModal, {
        data: this.data
      })
      this.$popover.close()
    },
    history() {
      this.$modals.show(EntryHistoryModal, {
        uuid: this.data.uuid
      })
      this.$popover.close()
    },
    edit() {
      this.$modals.show(ComposeModal, {
        data: this.data,
        mode: 'edit'
      })
      this.$popover.close()
    },
    delete() {
      this.$modals.show(EntryDeleteModal, {
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
    color: var(--x-body--color);
    font-size: 1.5rem;
    line-height: calc(1.4 * 1em);
    word-break: break-word;
    -webkit-font-smoothing: subpixel-antialiased;
    margin-bottom: .75rem;
  }

  &__attachments {
    margin-bottom: 1rem;
  }
}
</style>