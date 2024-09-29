<template>
  <div :class="[ 'community-item', 'community-item--mode-' + mode ]">
    <div class="community-item__content">
      <component :is="clickable ? 'router-link' : 'div'" v-bind="communityLinkBinds" class="community-item__name">
        {{ data.title }}
      </component>
      <div v-if="mode != 'small'" class="community-item__description">
        {{ data.description }}
      </div>
      <meta-info class="community-item__meta" :items="metaItems" />
    </div>
    <buttons-group :withGap="true" v-if="showSubscribeAction" class="community-item__actions">
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
  name: 'community-item',
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
    communityLink() {
      return { name: 'community', params: { slug: this.data.slug } }
    },
    communityLinkBinds() {
      if (this.clickable)
        return {
          to: this.communityLink,
          exactActiveClass: '',
          activeClass: ''
        }
      else 
        return { }
    },
    metaItems() {
      let _result = []

      //_result.push({ label: 'Category' })
      this.data.state.is_official && _result.push({ label: this.$t('community.meta.official') })
      _result.push({ label: this.$tc('community.meta.subscribers', this.data.counters.subscribers) })

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
        ...(this.data.state.is_me) ? [] : _bookmark,
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
        ? `community/${this.data.slug}/unsubscribe`
        : `community/${this.data.slug}/subscribe`
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
        object: 'community',
        community_id: this.data.community_id
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
      let _url = this.$router.resolve(this.communityLink)
      navigator.clipboard.writeText(window.location.origin + _url.fullPath).then(_ => {
        this.$alerts.success({ text: this.$t('success.link_copied') })
      })
      this.$popover.close()
    },
    report() {
      this.$modals.show(ReportCommunityModal, {
        data: this.data
      })
      this.$popover.close()
    }
  }
}
</script>

<style lang="scss">
.community-item {
  --community-item__name--color: var(--x-body--color);
  --community-item__name--color-hover: var(--x-body--color);
  --community-item__description--color: #666;
  --community-item__description--color-hover: var(--x-body--color);
  --community-item__avatar--background: rgba(0, 0, 0, 0.09);
  
  html[data-theme="black"] & {
    --community-item__name--color: var(--x-body--color);
    --community-item__name--color-hover: var(--x-body--color);
    --community-item__description--color: var(--x-color-white--shade40, #999);
    --community-item__description--color-hover: var(--x-body--color);
    --community-item__avatar--background: rgba(255, 255, 255, 0.09);
  }
}

.community-item {
  &--mode-hero {
    --community-item__avatar--size: 46px;
    --community-item__avatar--border-radius: 8px;
  }
  &--mode-normal {
    --community-item__avatar--size: 38px;
    --community-item__avatar--border-radius: 8px;
  }
  &--mode-small {
    --community-item__avatar--size: 18px;
    --community-item__avatar--border-radius: 4px;
  }
}

.community-item {
  display: flex;
  align-items: center;
  position: relative;

  &__avatar {
    background: var(--community-item__avatar--background, rgba(0, 0, 0, 0.09));
    border-radius: var(--community-item__avatar--border-radius, 8px);
    position: relative;
    overflow: hidden;
    width: var(--community-item__avatar--size, 38px);
    height: var(--community-item__avatar--size, 38px);
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
    color: var(--community-item__name--color, #212529);
    font-size: 1.3rem;
    font-weight: 500;
    line-height: calc(1.4 * 1em);

    @media(hover: hover) {
      &[href]:hover {
        color: var(--community-item__name--color-hover, #212529);
      }
    }
  }
  &__description {
    color: var(--community-item__description--color, #666);
    font-size: 1.3rem;
    font-weight: 400;
    line-height: calc(1.4 * 1em);
    margin-bottom: .75rem;
  }

  &__actions {
    margin-left: auto;
  }
}
</style>