<template>
  <div :class="[ 'feed-item', 'feed-item--mode-' + mode ]">
    <div class="feed-item__content">
      <component :is="clickable ? 'router-link' : 'div'" v-bind="feedLinkBinds" class="feed-item__name">
        {{ data.title }}
      </component>
      <div v-if="mode != 'small'" class="feed-item__description" v-html="$filters.contentFormat(data.description)" />
      <meta-info class="feed-item__meta" v-if="metaItems.length > 0" :items="metaItems" />
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
</template>

<script>
import { NButton, ButtonsGroup, MetaInfo } from '@vue-norma/ui'

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
    mode: {
      type: String,
      default: 'normal',
      validator(value) {
        return ['small', 'normal'].includes(value)
      }
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
    metaItems() {
      let _result = []

      //_result.push({ label: 'Category' })
      this.data.state.is_official && _result.push({ label: this.$t('feed.meta.official') })
      //_result.push({ label: this.$tc('feed.meta.subscribers', this.data.counters.subscribers) })

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
        _bookmark,
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
  --feed-item__description--color: #666;
  --feed-item__description--color-hover: var(--x-body--color);
  --feed-item__avatar--background: rgba(0, 0, 0, 0.09);
  
  html[data-theme="black"] & {
    --feed-item__name--color: var(--x-body--color);
    --feed-item__name--color-hover: var(--x-body--color);
    --feed-item__description--color: var(--x-color-white--shade40, #999);
    --feed-item__description--color-hover: var(--x-body--color);
    --feed-item__avatar--background: rgba(255, 255, 255, 0.09);
  }
}

.feed-item {
  &--mode-hero {
    --feed-item__avatar--size: 46px;
    --feed-item__avatar--border-radius: 8px;
  }
  &--mode-normal {
    --feed-item__avatar--size: 38px;
    --feed-item__avatar--border-radius: 8px;
  }
  &--mode-small {
    --feed-item__avatar--size: 18px;
    --feed-item__avatar--border-radius: 4px;
  }
}

.feed-item {
  display: flex;
  align-items: center;
  position: relative;

  &__avatar {
    background: var(--feed-item__avatar--background, rgba(0, 0, 0, 0.09));
    border-radius: var(--feed-item__avatar--border-radius, 8px);
    position: relative;
    overflow: hidden;
    width: var(--feed-item__avatar--size, 38px);
    height: var(--feed-item__avatar--size, 38px);
    margin-right: .75rem;
    flex-shrink: 0;
    
    @media(hover: hover) {
      &:hover { color: inherit; text-decoration: none; }
    }

    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    position: relative;
    align-items: start;
  }

  &__name {
    color: var(--feed-item__name--color, #212529);
    font-size: 1.3rem;
    font-weight: 500;
    line-height: calc(1.4 * 1em);

    @media(hover: hover) {
      &[href]:hover {
        color: var(--feed-item__name--color-hover, #212529);
      }
    }
  }
  &__description {
    color: var(--feed-item__description--color, #666);
    font-size: 1.3rem;
    font-weight: 400;
    line-height: calc(1.4 * 1em);
  }

  &__meta {
    margin-top: .75rem;
  }

  &__actions {
    margin-left: auto;
  }
}
</style>