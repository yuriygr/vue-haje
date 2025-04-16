<template>
  <div :class="[ 'feed-item' ]">
    <div class="feed-item__icon">
      {{ data.emoji }}
    </div>
    <div class="feed-item__content">
      <component :is="clickable ? 'router-link' : 'div'" v-bind="feedLinkBinds" class="feed-item__name">
        {{ data.title }}
      </component>
  
      <meta-info class="feed-item__meta" :items="metaItems" />
    </div>
    <buttons-group :withGap="true" v-if="showSubscribeAction" class="feed-item__actions">
      <n-button
        :icon_before="data.state.me_subscribed ? 'check-line' : 'add-line'"
        mode="tertiary"
        @click.exact="toggleSubscribe"
        :disabled="loading.subscribe"
        :title="$t(data.state.me_subscribed ? 'action.unsubscribe' : 'action.subscribe')"
      />
      <n-button icon_before="ui-more" mode="tertiary" @click.exact="toggleOptions" ref="options" :title="$t('action.options')" />
    </buttons-group>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { NButton, ButtonsGroup, MetaInfo } from '@vue-norma/ui'

let FeedReportModal = defineAsyncComponent(() => import("@/components/modals/_feed/Report.vue"))


export default {
  name: 'feed-item',
  components: {
    NButton, ButtonsGroup, MetaInfo
  },
  props: {
    data: false,
    clickable: {
      type: Boolean,
      default: true
    },
    showSubscribeAction: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: {
        subscribe: false,
        bookmarks: false
      }
    }
  },
  computed: {
    feedLink() {
      return { name: 'feed-custom', params: { uuid: this.data.uuid } }
    },
    feedLinkBinds() {
      if (this.clickable)
        return {
          to: this.feedLink,
          exactActiveClass: '',
          activeClass: ''
        }
      else 
        return { }
    },
    authorLink() {
      return 
    },
    metaItems() {
      let _result = []
      _result.push({ label: this.$tc('feed.meta.author', { author: this.data.author.name }), to: { name: 'user', params: { username: this.data.author.username } } })
      return _result
    },
    optionsItems() {
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
        ..._bookmark,
        {
          icon: 'ui-link',
          label: this.$t('action.copy_link'),
          action: this.copyLink
        },
        {
          icon: 'ui-error-warning',
          label: this.$t('action.report'),
          action: this.report
        }
      ]
    }
  },
  methods: {
    // Опции
    toggleOptions(e) {
      let target = typeof e == "object" ? e.currentTarget : this.$refs.options.$el
      this.$popover.open({
        items: this.optionsItems,
        target: target,
        align: 'right'
      })
    },
    // Подписки
    toggleSubscribe() {
      this.loading.subscribe = true
      let _path = this.data.state.me_subscribed
        ? `feed/${this.data.uuid}/unsubscribe`
        : `feed/${this.data.uuid}/subscribe`
      this.$api.post(_path)
      .then(result => {
        this.data.state.me_subscribed = (result.status == 'subscribed')
        this.$alerts.success({ text: this.$t(`success.${result.status}`) })
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`errors.${error.status}`) })
      })
      .then(_ => this.loading.subscribe = false)
    },

    toggleBookmarks() {
      this.loading.bookmarks = true
      this.$api.post('my/bookmarks', {
        type: this.data.state.is_bookmarked ? 'remove' : 'add',
        object: 'feed',
        feed_id: this.data.feed_id
      })
      .then(result => {
        this.data.state.is_bookmarked = (result.status == 'added')
        this.$alerts.success({ text: this.$t(`success.${result.status}`) })
        this.$popover.close()
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`errors.${error.status}`) })
      })
      .then(_ => this.loading.bookmarks = false)
    },

    reportFeed(reason = 0) {
      return this.$api.post(`feed/${this.data.uuid}/report`, { reason })
      .then(result => {
        this.$alerts.success({ text: this.$t(`success.${result.status}`) })
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`errors.${error.status}`) })
      })
    },

    // Остальные действия
    copyLink() {
      let _url = this.$router.resolve(this.feedLink)
      navigator.clipboard.writeText(window.location.origin + _url.fullPath).then(_ => {
        this.$alerts.success({ text: this.$t('success.link_copied') })
      })
      this.$popover.close()
    },
    report() {
      this.$modals.show(FeedReportModal, {
        reportFeed: this.reportFeed
      })
      this.$popover.close()
    }
  }
}
</script>

<style lang="scss">
.feed-item {
  --feed-item__icon--background: #fafafa;
  --feed-item__name--color: var(--x-body--color);
  --feed-item__name--color-hover: var(--x-body--color);
  
  html[data-theme="black"] & {
    --feed-item__icon--background: #171717;
    --feed-item__name--color: var(--x-body--color);
    --feed-item__name--color-hover: var(--x-body--color);
  }
}

.feed-item {
  --feed-item__icon--size: 40px;
}

.feed-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;

  &__icon {
    background: var(--feed-item__icon--background, rgba(0, 0, 0, 0.09));
    margin-right: .75rem;
    position: relative;
    overflow: hidden;
    width: var(--feed-item__icon--size);
    height: var(--feed-item__icon--size);
    border-radius: 8px;
    
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    position: relative;
    align-items: flex-start;
    flex: 1;
  }

  &__name {
    color: var(--feed-item__name--color);
    font-size: 1.4rem;
    font-weight: 400;
    line-height: calc(1.4 * 1em);
    transition: var(--x-transition);
    margin-bottom: 0.25rem;

    @media(hover: hover) {
      &[href]:hover {
        text-decoration: none;
        color: var(--feed-item__name--color-hover);
      }
    }
  }

  &__author {
    color: var( --feed-item__author--color);
    font-weight: 400;
    font-size: 1.2rem;
    line-height: calc(1.3 * 1em);
    transition: var(--x-transition);

    @media(hover: hover) {
      &[href]:hover {
        text-decoration: none;
        color: var(--feed-item__author--color-hover);
      }
    }
  }
  
  &__actions {
    margin-left: auto;
  }
}
</style>