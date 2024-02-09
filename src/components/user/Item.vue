<template>
  <div :class="[ 'user-item', 'user-item--mode-' + mode ]">
    <component :is="clickable ? 'router-link' : 'div'" v-bind="userLinkBinds" class="user-item__avatar">
      <img :src="avatarUrl(72)" alt="" />
    </component>
    <template v-if="mode == 'normal'">
      <div class="user-item__content">
        <component :is="clickable ? 'router-link' : 'div'" v-bind="userLinkBinds" class="user-item__name">
          {{ data.name }}
        </component>
        <component :is="clickable ? 'router-link' : 'div'" v-bind="userLinkBinds" class="user-item__username">@{{ data.username }}</component>
      </div>
      <buttons-group :withGap="true" v-if="showSubscribeAction && !data.state.is_me" class="user-item__actions">
        <template v-if="data.state.me_subscribed">
          <icon-button name="user-follow-line" mode="tertiary" @click.exact="unsubscribe" :disabled="loading.unsubscribe" :title="$t('user.action.unsubscribe')" />
        </template>
        <template v-else>
          <icon-button name="user-add-line" mode="tertiary" @click.exact="subscribe" :disabled="loading.subscribe" :title="$t('user.action.subscribe')" />
        </template>
        <icon-button name="ui-more" mode="tertiary" @click.exact="toggleOptions" ref="options" :title="$t('user.action.options')" />
      </buttons-group>
    </template>
    <template v-if="mode == 'small'">
      <component :is="clickable ? 'router-link' : 'div'" v-bind="userLinkBinds" class="user-item__name">
        {{ data.name }}
      </component>
    </template>
  </div>
</template>

<script>
import { Icon, IconButton, ButtonsGroup } from '@vue-norma/ui'

import ReportUserModal  from '@/components/modals/ReportUser'

export default {
  name: 'user-item',
  components: {
    Icon, IconButton, ButtonsGroup
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
        return ['normal', 'small'].includes(value)
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
        unsubscribe: false,
        subscribe: false
      }
    }
  },
  computed: {
    userLink() {
      return { name: 'user', params: { username: this.data.username } }
    },
    userLinkBinds() {
      if (this.clickable)
        return {
          to: this.userLink,
          exactActiveClass: '',
          activeClass: ''
        }
      else 
        return {

        }
    },
    optionsItems() {
      let _bookmark = [
        this.data.state.is_bookmarked ?
        {
          icon: 'ui-bookmark-remove',
          label: this.$t('user.action.remove-bookmark'),
          action: this.toggleBookmarks
        } : {
          icon: 'ui-bookmark-add',
          label: this.$t('user.action.add-bookmark'),
          action: this.toggleBookmarks
        }
      ]

      return [
        ...(this.data.state.is_me) ? [] : _bookmark,
        {
          icon: 'ui-link',
          label: this.$t('user.action.copy_link'),
          action: this.copyLink
        },
        {
          icon: 'ui-error-warning',
          label: this.$t('user.action.report'),
          action: this.report
        },
      ]
    }
  },
  methods: {
    avatarUrl(size) {
      return `https://www.gravatar.com/avatar/${this.data.avatar.md5}?s=${size}&d=identicon`
    },
    unsubscribe() {
      this.loading.unsubscribe = true
      this.$api.post(`user/${this.data.username}/unsubscribe`)
      .then(result => {
        console.log(result)
        this.data.state.me_subscribed = !(result.status == 'unsubscribed')
      })
      .catch(error => {
        this.$alerts.danger({ text: error.status })
      })
      .then(_ => {
        this.loading.unsubscribe = false
      })
    },
    subscribe() {
      this.loading.subscribe = true
      this.$api.post(`user/${this.data.username}/subscribe`)
      .then(result => {
        console.log(result)
        this.data.state.me_subscribed = (result.status == 'subscribed')
      })
      .catch(error => {
        this.$alerts.danger({ text: error.status })
      })
      .then(_ => {
        this.loading.subscribe = false
      })
    },
    toggleBookmarks() {
      this.$api.post('my/bookmarks', {
        type: this.data.state.is_bookmarked ? 'remove' : 'add',
        object: 'user',
        user_id: this.data.user_id
      })
      .then(result => {
        this.data.state.is_bookmarked = (result.status == 'added')
        this.$alerts.success({ text: result.status })
        this.$popover.close()
      })
      .catch(error => this.$alerts.danger({ text: error.status }))
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
      let _url = this.$router.resolve(this.userLink)
      navigator.clipboard.writeText(window.location.origin + _url.fullPath).then(_ => {
        this.$alerts.success({ text: this.$t('success.link_copied') })
      })
      this.$popover.close()
    },
    report() {
      this.$modals.show(ReportUserModal, {
        data: this.data
      })
      this.$popover.close()
    }
  }
}
</script>

<style lang="scss">
.user-item {
  --user-item__name--color: #111;
  --user-item__name--color-hover: #111;
  --user-item__username--color: #666;
  --user-item__username--color-hover: #111;
  
  html[data-theme="black"] & {
    --user-item__name--color: #fffcea;
    --user-item__name--color-hover: #fffcea;
    --user-item__username--color: #999;
    --user-item__username--color-hover: #fffcea;
  }
}

.user-item {
  &--mode-normal {
    --user-item__avatar-size: 38px;
    --user-item__avatar-border-radius: 8px;
  }
  &--mode-small {
    --user-item__avatar-size: 18px;
    --user-item__avatar-border-radius: 4px;
  }
}

.user-item {
  display: flex;
  align-items: center;
  position: relative;

  &__avatar {
    background: #00000019;
    border-radius: var(--user-item__avatar-border-radius, 8px);
    position: relative;
    overflow: hidden;
    width: var(--user-item__avatar-size, 38px);
    height: var(--user-item__avatar-size, 38px);
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
  }

  &__name {
    color: var(--user-item__name--color, #111);
    font-size: 1.3rem;
    font-weight: var(--x-font-weight--semi-bold);
    line-height: calc(1.4 * 1em);

    @media(hover: hover) {
      &:is(a):hover {
        color: var(--user-item__name--color-hover, #111);
      }
    }
  }
  &__username {
    color: var(--user-item__username--color, #666);
    font-size: 1.3rem;
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.4 * 1em);

    @media(hover: hover) {
      &:is(a):hover {
        color: var(--user-item__username--color-hover, #111);
      }
    }
  }

  &__actions {
    margin-left: auto;
  }
}
</style>