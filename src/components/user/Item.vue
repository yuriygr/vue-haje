<template>
  <template v-if="data">
    <div :class="[ 'user-item', 'user-item--mode-' + mode ]">
      <component :is="clickable ? 'router-link' : 'div'" v-bind="userLinkBinds" class="user-item__avatar">
        <img :src="avatarUrl" alt="" />
      </component>

      <template v-if="!onlyAvatar">
        <div class="user-item__content">
          <component :is="clickable ? 'router-link' : 'div'" v-bind="userLinkBinds" class="user-item__name">
            {{ localData.name }}
            <span v-if="localData.state.is_verified" class="user-item__verified">
              <icon name="verify-fill" size="12" />
            </span>
          </component>
          <component v-if="mode != 'small'" :is="clickable ? 'router-link' : 'div'" v-bind="userLinkBinds" class="user-item__username">
            @{{ localData.username }}
          </component>
        </div>
        <buttons-group :withGap="true" v-if="showSubscribeAction && !localData.state.is_me" class="user-item__actions">
          <n-button
            :icon_before="localData.state.me_subscribed ? 'user-follow-line' : 'user-add-line'"
            mode="tertiary"
            @click.exact="toggleSubscribe"
            :disabled="loading.subscribe"
            :title="$t(localData.state.me_subscribed ? 'action.unsubscribe' : 'action.subscribe')"
          />
          <n-button icon_before="ui-more" mode="tertiary" @click.exact="toggleOptions" ref="options" :title="$t('action.options')" />
        </buttons-group>
      </template>
    </div>
  </template>

  <template v-else>
    <div :class="[ 'user-item', 'user-item--mode-' + mode ]">
      <div class="user-item__avatar"></div>
      <template v-if="!onlyAvatar">
        <div class="user-item__content">
          <div class="user-item__name">
            <skeleton :width="skeletonWidths.name" :height="9" />
          </div>
          <div v-if="mode != 'small'" class="user-item__username">
            <skeleton :width="skeletonWidths.username" :height="8" />
          </div>
        </div>
        <buttons-group :withGap="true" v-if="showSubscribeAction" class="user-item__actions">
          <n-button icon_before="user-add-line" mode="tertiary" :disabled="true" :title="$t('action.subscribe')" />
          <n-button icon_before="ui-more" mode="tertiary" :disabled="true" :title="$t('action.options')" />
        </buttons-group>
      </template>
    </div>
  </template>
</template>

<script>
import { Icon, NButton, ButtonsGroup } from '@vue-norma/ui'

import { userActionsMixin } from '@/app/mixins/userActionsMixin'

export default {
  name: 'user-item',
  mixins: [userActionsMixin],
  components: {
    Icon, NButton, ButtonsGroup
  },
  props: {
    data: {
      type: Object,
      default: null
    },
    clickable: {
      type: Boolean,
      default: true
    },
    mode: {
      type: String,
      default: 'normal',
      validator(value) {
        return ['hero', 'normal', 'small'].includes(value)
      }
    },
    showSubscribeAction: {
      type: Boolean,
      default: true
    },
    onlyAvatar: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sizes: {
        'hero': 120,
        'normal': 55,
        'small': 40
      },
      skeletonWidths: {
        name: Math.floor(Math.random() * 100) + 60,
        username: Math.floor(Math.random() * 100) + 50
      }
    }
  },
  computed: {
    avatarUrl() {
      return `https://www.gravatar.com/avatar/${this.localData.avatar.hash}?s=${this.sizes[this.mode]}&d=identicon`
    },
    userLinkBinds() {
      if (this.clickable)
        return {
          to: this.userLink,
          exactActiveClass: '',
          activeClass: ''
        }
      else 
        return { }
    },
    optionsItems() {
      let _bookmark = [
        this.localData.state.is_bookmarked ?
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
        ...(this.localData.state.is_me) ? [] : _bookmark,
        {
          icon: 'ui-link',
          label: this.$t('action.copy_link'),
          action: this.copyLink
        },
        ...(this.localData.state.is_me) ? [] : [
          {
            icon: 'ui-error-warning',
            label: this.$t('action.report'),
            action: this.report
          }
        ],
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
    }
  }
}
</script>

<style lang="scss">
.user-item {
  --user-item__name--color: var(--x-body--color);
  --user-item__name--color-hover: var(--x-body--color);
  --user-item__username--color: #666;
  --user-item__username--color-hover: var(--x-body--color);
  --user-item__avatar--background: rgba(0, 0, 0, 0.09);
  
  html[data-theme="black"] & {
    --user-item__name--color: var(--x-body--color);
    --user-item__name--color-hover: var(--x-body--color);
    --user-item__username--color: var(--x-color-white--shade40, #999);
    --user-item__username--color-hover: var(--x-body--color);
    --user-item__avatar--background: rgba(255, 255, 255, 0.05);
  }
}

.user-item {
  &--mode-hero {
    --user-item__avatar--size: 46px;
    --user-item__avatar--border-radius: 8px;
  }
  &--mode-normal {
    --user-item__avatar--size: 36px;
    --user-item__avatar--border-radius: 8px;
  }
  &--mode-small {
    --user-item__avatar--size: 18px;
    --user-item__avatar--border-radius: 4px;
  }
}

.user-item {
  display: flex;
  align-items: center;
  position: relative;

  &__avatar {
    background: var(--user-item__avatar--background, rgba(0, 0, 0, 0.09));
    border-radius: var(--user-item__avatar--border-radius, 8px);
    position: relative;
    overflow: hidden;
    width: var(--user-item__avatar--size, 34px);
    height: var(--user-item__avatar--size, 34px);
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
    align-items: flex-start;
  }

  &__name {
    display: inline-flex;
    align-items: center;
    color: var(--user-item__name--color, #212529);
    font-weight: 500;
    font-size: 1.3rem;
    line-height: calc(1.3 * 1em);
    transition: var(--x-transition);

    @media(hover: hover) {
      &[href]:hover {
        text-decoration: none;
        color: var(--user-item__name--color-hover, #212529);
      }
    }
  }

  &__verified {
    color: var(--x-color-pink--shade30);
    margin-left: .5rem;

    svg { fill: currentColor; flex-shrink: 0; display: block; }
  }

  &__username {
    color: var(--user-item__username--color, #666);
    font-weight: 400;
    font-size: 1.2rem;
    line-height: calc(1.3 * 1em);
    transition: var(--x-transition);

    @media(hover: hover) {
      &[href]:hover {
        text-decoration: none;
        color: var(--user-item__username--color-hover, #212529);
      }
    }
  }

  &__actions {
    margin-left: auto;
  }
}
</style>