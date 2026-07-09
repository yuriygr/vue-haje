<template>
  <template v-if="data">
    <div :class="[ 'entry' ]">
      <div class="entry__header">
        <user-item :data="data.user" :showSubscribeAction="false" />
        <buttons-group class="entry__options">
          <n-button icon_before="ui-eye-off" v-if="data.state.is_hidden_from_feed" mode="tertiary" :disabled="true" :title="$t('entry.meta.hidden_from_feed')" />
          <n-button icon_before="ui-pushpin" v-if="showPinAction && data.state.is_pinned" mode="tertiary" :disabled="true" :title="$t('entry.meta.pinned')" />
          <n-button icon_before="ui-more" mode="tertiary" @click.exact="toggleOptions" ref="options" :title="$t('action.options')" />
        </buttons-group>
      </div>
      <div v-if="data.content.text" class="entry__content" v-markup="data.content.text" />
      <attachments class="entry__attachments" v-if="data.files || data.links" :files="data.files" :links="data.links" mode="full" />
      <meta-info class="entry__meta" :items="metaItems" />
      <div v-if="data.pinned_comment && type == 'short'"  class="entry__pinned_comment">
        <user-item :data="data.pinned_comment.user" :showSubscribeAction="false" mode="small"/>
        <div class="pinned_comment__content" v-markup="data.pinned_comment.content.text" />
      </div>
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
        <skeleton :width="skeletonWidths.q" :height="9" />
        <br />
        <skeleton :width="skeletonWidths.w" :height="9" />
        <br />
        <skeleton :width="skeletonWidths.e" :height="9" />
        <br />
        <skeleton :width="skeletonWidths.r" :height="9" />
        <br />
        <skeleton :width="skeletonWidths.t" :height="8" /> <skeleton :width="skeletonWidths.y" :height="8" />
      </div>
    </div>
  </template>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { Icon, NButton, ButtonsGroup, MetaInfo } from '@vue-norma/ui'

import { useEntryStore } from '@/app/components/stores/modules/entry'
import { useTimeAgo } from '@/app/composables/useTimeAgo.js'
import { useModals } from '@vue-norma/ui'

const ComposeModal = defineAsyncComponent(() => import("@/modals/Compose.vue"))

const EntryPinModal = defineAsyncComponent(() => import("@/modals/_entry/Pin.vue"))
const EntryHistoryModal = defineAsyncComponent(() => import("@/modals/_entry/History.vue"))
const EntryDeleteModal = defineAsyncComponent(() => import("@/modals/_entry/Delete.vue"))

const ReportModal = defineAsyncComponent(() => import("@/modals/Report.vue"))

import { UserItem } from '@/components/user'
import Attachments from '@/components/attachments'

export default {
  name: 'entry-item',
  components: {
    UserItem, Attachments,
    Icon, NButton, ButtonsGroup, MetaInfo
  },
  props: {
    data: {
      type: Object
    },
    type: {
      type: String,
      default: 'short',
      validator(value) {
        return ['short', 'full'].includes(value)
      }
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
        bookmarks: false
      },
      skeletonWidths: {
        q: Math.floor(Math.random() * 100) + 220,
        w: Math.floor(Math.random() * 100) + 200,
        e: Math.floor(Math.random() * 100) + 80,
        r: Math.floor(Math.random() * 100) + 190,
        t: Math.floor(Math.random() * 100) + 55,
        y: Math.floor(Math.random() * 100) + 70,
      }
    }
  },
  setup() {
    const entryStore = useEntryStore()
    const { timeAgo, fullDate } = useTimeAgo()
    const modals = useModals()
    return { entryStore, timeAgo, fullDate, modals }
  },
  computed: {
    metaItems() {
      let _result = []

      this.data.state.is_comments_enabled && _result.push({ label: this.$t('entry.meta.comments', this.data.counters.comments), to: this.commentsLink, action: this.prefetchEntry })
      _result.push({ label: this.formattedDate, to: this.entryLink, action: this.prefetchEntry })
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
          action: this.pin
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
        ...(this.data.user.state.is_me) ? _edit : [{
          icon: 'ui-error-warning',
          label: this.$t('action.report'),
          action: this.report
        }]
      ]
    },
    formattedDate() {
      return this.type == 'short'
        ? this.timeAgo(this.data.meta.date_added)
        : this.fullDate(this.data.meta.date_added)
    },
  },
  methods: {
    prefetchEntry(e) {
      this.entryStore.preFetch(this.data)
    },
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
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
    },
    subscribe() {
      this.$api.post(`user/${this.data.user.username}/subscribe`)
      .then(result => {
        this.data.user.state.me_subscribed = (result.status == 'subscribed')
        this.$popover.close()
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
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

        this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })
        this.$popover.close()
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
      .then(_ =>  this.loading.bookmarks = false)
    },

    togglePin() {
      let path = this.data.state.is_pinned
        ? `entry/${this.data.uuid}/unpin`
        : `entry/${this.data.uuid}/pin`
      return this.$api.post(path)
      .then(result => {
        this.data.state.is_pinned = (result.status == 'entry_pinned')
        this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })
        this.$popover.close()
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
    },

    reportEntry(reason = 0) {
      return this.$api.post(`entry/${this.data.uuid}/report`, { reason })
      .then(result => {
        this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
    },

    deleteEntry() {
      return this.$api.delete(`entry/${this.data.uuid}`)
      .then(result => {
        this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
    },

    // Modals
    pin() {
      this.modals.show(EntryPinModal, {
        pinEntry: this.togglePin
      })
      this.$popover.close()
    },
    report() {
      this.modals.show(ReportModal, {
        callback: this.reportEntry
      })
      this.$popover.close()
    },
    history() {
      this.modals.show(EntryHistoryModal, {
        uuid: this.data.uuid
      })
      this.$popover.close()
    },
    edit() {
      this.modals.show(ComposeModal, {
        data: this.data,
        mode: 'edit'
      })
      this.$popover.close()
    },
    delete() {
      this.modals.show(EntryDeleteModal, {
        deleteEntry: this.deleteEntry
      })
      this.$popover.close()
    }
  }
}
</script>

<style lang="scss">
.entry {
  --pinned_comment-border--color: rgba(0, 0, 0, 0.07); 

  html[data-theme="black"] & {
    --pinned_comment-border--color: rgba(255, 255, 255, 0.07); 
  }
}


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
    overflow: hidden;
    -webkit-font-smoothing: subpixel-antialiased;
    margin-bottom: .75rem;
  }

  &__attachments {
    margin-bottom: 1rem;
  }

  &__pinned_comment {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    padding: .75rem;
    margin-top: 1rem;
    position: relative;
    overflow: hidden;
    border-radius: 6px;
    width: 100%;
    border: 1px solid var(--pinned_comment-border--color);

    @include on-mobile-device {
      grid-template-columns: auto;
      gap: .5rem;
    }

    .user-item {
      margin-right: .75rem;
    }

    .pinned_comment__content {
      font-size: 1.2rem;
      line-height: 1.3em;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>