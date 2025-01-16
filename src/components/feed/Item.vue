<template>
  <div :class="[ 'feed-item' ]">
    <div class="feed-item__header">
      <div class="feed-item__icon">
        {{ data.emoji }}
      </div>
      <div class="feed-item__content">
        <component :is="clickable ? 'router-link' : 'div'" v-bind="feedLinkBinds" class="feed-item__name">
          {{ data.title }}
        </component>
        <router-link class="feed-item__author" :to="authorLink">{{ $tc('feed.meta.author', { author: this.data.author.name }) }}</router-link>
      </div>
      <buttons-group :withGap="true" v-if="showSubscribeAction" class="feed-item__actions">
        <n-button
          :icon_before="data.state.me_subscribed ? 'user-follow-line' : 'user-add-line'"
          mode="tertiary"
          @click.exact="toggleSubscribe"
          :disabled="loading.subscribe"
          :title="$t(data.state.me_subscribed ? 'action.unsubscribe' : 'action.subscribe')"
        />
        <n-button icon_before="ui-more" mode="tertiary" @click.exact="toggleOptions" ref="options" :title="$t('action.options')" />
      </buttons-group>
    </div>
    <div class="feed-item__description" v-html="$filters.contentFormat(data.description)" />

  </div>
</template>

<script>
import { NButton, ButtonsGroup, MetaInfo } from '@vue-norma/ui'

import { UserItem } from '@/components/user'

export default {
  name: 'feed-item',
  components: {
    UserItem,
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
      return { name: 'user', params: { username: this.data.author.username } }
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
        this.$alerts.success({ text: result.status })
      })
      .catch(error => this.$alerts.danger({ text: error.status }))
      .then(_ => this.loading.subscribe = false)
    },
    // Переключалка закладок
    toggleBookmarks() {
      this.loading.bookmarks = true
      this.$api.post('my/bookmarks', {
        type: this.data.state.is_bookmarked ? 'remove' : 'add',
        object: 'feed',
        feed_id: this.data.feed_id
      })
      .then(result => {
        this.data.state.is_bookmarked = (result.status == 'added')
        this.$alerts.success({ text: result.status })
        this.$popover.close()
      })
      .catch(error => this.$alerts.danger({ text: error.status }))
      .then(_ => this.loading.bookmarks = false)
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
      this.$modals.show(ReportfeedModal, {
        data: this.data
      })
      this.$popover.close()
    }
  }
}
</script>

<style lang="scss">
.feed-item {
  --feed-item__name--color: var(--x-body--color);
  --feed-item__name--color-hover: var(--x-body--color);

  --feed-item__author--color: #666;
  --feed-item__author--color-hover: var(--x-body--color);

  --feed-item__description--color: var(--x-body--color);
  --feed-item__description--color-hover: var(--x-body--color);
  --feed-item__icon--background: rgba(0, 0, 0, 0.09);
  
  html[data-theme="black"] & {
    --feed-item__name--color: var(--x-body--color);
    --feed-item__name--color-hover: var(--x-body--color);
    
    --feed-item__author--color: var(--x-color-white--shade40);
    --feed-item__author--color-hover: var(--x-body--color);

    --feed-item__description--color: var(--x-color-white);
    --feed-item__description--color-hover: var(--x-body--color);
    --feed-item__icon--background: rgba(255, 255, 255, 0.09);
  }
}

.feed-item {
  --feed-item__icon--size: 40px;
  --feed-item__icon--border-radius: 8px;
}

.feed-item {
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    position: relative;
  }

  &__icon {
    background: var(--feed-item__icon--background, rgba(0, 0, 0, 0.09));
    border-radius: var(--feed-item__icon--border-radius, 8px);
    position: relative;
    overflow: hidden;
    width: var(--feed-item__icon--size, 38px);
    height: var(--feed-item__icon--size, 38px);
    margin-right: .75rem;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    position: relative;
    align-items: start;
  }

  &__name {
    color: var(--feed-item__name--color);
    font-weight: 500;
    font-size: 1.3rem;
    line-height: calc(1.3 * 1em);
    transition: var(--x-transition);

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

  &__description {
    color: var(--x-body--color);
    font-size: 1.5rem;
    line-height: calc(1.4 * 1em);
    word-break: break-word;
    -webkit-font-smoothing: subpixel-antialiased;
    margin-top: .75rem;
  }

  &__actions {
    margin-left: auto;
  }
}
</style>