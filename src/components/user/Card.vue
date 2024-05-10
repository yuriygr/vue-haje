<template>
  <div class="user-card">
    <div class="user-card__content-wrapper">
      <div class="user-card__content">
        <div class="user-card__name">{{ data.profile.name }}</div>
        <div class="user-card__username">@{{ data.username }}</div>
      </div>
      <div class="user-card__avatar user-card__avatar__has-view" @click.exact="viewAvatar">
        <img :src="avatarUrl" alt="" />
      </div>
    </div>
    <div v-if="data.profile.bio" class="user-card__bio" v-html="$filters.contentFormat(data.profile.bio)" />
    <meta-info class="user-card__meta" :items="metaItems" />
    
    <spacer height="20" />
    
    <buttons-group :withGap="true" v-if="!data.state.is_me" class="user-card__actions">
      <template v-if="data.state.me_subscribed">
        <n-button mode="secondary" :stretched="true" :disabled="actions_loading.unsubscribe" @click.exact="unsubscribe" icon_before="user-follow-line">
          {{ $t('user.action.unsubscribe') }}
        </n-button>
      </template>
      <template v-else>
        <n-button mode="secondary" :stretched="true" :disabled="actions_loading.subscribe" @click.exact="subscribe" icon_before="user-add-line" >
          {{ $t('user.action.subscribe') }}
        </n-button>
      </template>
      <n-button v-if="data.external_link" :icon_before="$t(`brands.${data.external_link.code}.icon`)" mode="secondary" component="a" target="_blank" :href="data.external_link.url">
        {{ $t(`brands.${data.external_link.code}.label`) }}
      </n-button>
      <icon-button name="ui-more" mode="secondary" @click.exact="toggleOptions" ref="options" :title="$t('user.action.options')" />
    </buttons-group>

    <buttons-group :withGap="true" v-else class="user-card__actions">
      <n-button mode="secondary" component="router-link" :stretched="true" :to="{ name: 'menu' }" icon_before="menu-line">
        {{ $t('user.action.menu') }}
      </n-button>
      <n-button mode="secondary" component="router-link"  :to="{ name: 'settings' }" icon_before="settings-line">
        {{ $t('user.action.settings') }}
      </n-button>
      <icon-button component="router-link" name="logout-line" mode="secondary" :to="{ name: 'auth-logout' }" :title="$t('user.action.logout')" />
    </buttons-group>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { Icon, IconButton, NButton, ButtonsGroup, MetaInfo, Spacer } from '@vue-norma/ui'

let UserAvatarView = defineAsyncComponent(() => import("@/components/modals/UserAvatarView.vue"))
let ReportUserModal = defineAsyncComponent(() => import("@/components/modals/ReportUser.vue"))

export default {
  name: 'user-card',
  components: {
    Icon, IconButton, NButton, ButtonsGroup, MetaInfo, Spacer
  },
  props: {
    data: false
  },
  data() {
    return {
      actions_loading: {
        unsubscribe: false,
        subscribe: false
      }
    }
  },
  computed: {
    avatarUrl() {
      let size = 100

      return `https://www.gravatar.com/avatar/${this.data.avatar.hash}?s=${size}&d=identicon`
    },
    metaItems() {
      let _result = []

      _result.push({ label: this.$t('user.meta.from_date', { date: this.formatedDate }) })
      _result.push({ label: this.$tc('user.meta.badges', this.data.counters.badges), to: { name: 'user-badges' } })
      _result.push({ label: this.$tc('user.meta.links', this.data.counters.links), to: { name: 'user-links' } })

      return _result
    },
    formatedDate() {
      return this.$filters.timeFormatOnlyYear(this.data.meta.date_added, this.$i18n.locale)
    },
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
        return { }
    },
    optionsItems() {
      let _notify = [
        this.data.state.me_subscribed_to_new_posts ?
        {
          icon: 'ui-notification-off',
          label: this.$t('user.action.dont_notify_new_posts'),
          action: this.toggleNotify
        } : {
          icon: 'ui-notification',
          label: this.$t('user.action.notify_new_posts'),
          action: this.toggleNotify
        }
      ]

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
        ...(this.data.state.is_me) ? [] : _notify,
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
        }
      ]
    }
  },
  methods: {
    // Подписки
    unsubscribe() {
      this.actions_loading.unsubscribe = true
      this.$api.post(`user/${this.data.username}/unsubscribe`)
      .then(result => {
        this.data.state.me_subscribed = !(result.status == 'unsubscribed')
        this.data.counters.subscribers -= 1
      })
      .catch(error => this.$alerts.danger({ text: error.status }))
      .then(_ => this.actions_loading.unsubscribe = false)
    },
    subscribe() {
      this.actions_loading.subscribe = true
      this.$api.post(`user/${this.data.username}/subscribe`)
      .then(result => {
        this.data.state.me_subscribed = (result.status == 'subscribed')
        this.data.counters.subscribers += 1
      })
      .catch(error => this.$alerts.danger({ text: error.status }))
      .then(_ => this.actions_loading.subscribe = false)
    },
  
    // Опции
    toggleOptions(e) {
      let target = typeof e == "object" ? e.currentTarget : this.$refs.options.$el
      this.$popover.open({
        items: this.optionsItems,
        target: target,
        align: 'right'
      })
    },
    // Переключалка уведомлений
    toggleNotify() {
      let _path = this.data.state.me_subscribed_to_new_posts
        ? `user/${this.data.username}/unnotify`
        : `user/${this.data.username}/notify`
      this.$api.post(_path)
      .then(result => {
        this.data.state.me_subscribed_to_new_posts = (result.status == 'subscribed')
        this.$alerts.success({ text: result.status })
        this.$popover.close()
      })
      .catch(error => this.$alerts.danger({ text: error.status }))
    },
    // Переключалка закладок
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
    // Остальные действия
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
    },
    // Да-да
    viewAvatar() {
      this.$modals.show(UserAvatarView, {
        data: this.data
      })
    }
  }
}
</script>

<style lang="scss">
$avatar-size: 57px;

.user-card {
  --user-card__username--color: #495057;
  --user-card__avatar--background: rgba(0, 0, 0, 0.09);

  html[data-theme="black"] & {
    --user-card__username--color: #999;
    --user-card__avatar--background: rgba(255, 255, 255, 0.09);
  }
}

.user-card {
  --user-card--padding: 1.5rem;

  &__content-wrapper {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: var(--user-card--padding);
  }

  &__content {
    flex: 1;
  }

  &__name {
    white-space: pre-line;
    word-wrap: break-word;
    word-break: break-word;
    font-size: 2.4rem;
    font-weight: var(--x-font-weight--bold);
    line-height: calc(1.5 * 1em);
  }
  &__username {
    white-space: nowrap;
    text-overflow: ellipsis;
    word-wrap: break-word;
    word-break: break-word;
    font-size: 1.5rem;
    color: var(--user-card__username--color, #495057);
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.4 * 1em);
  }

  &__bio {
    font-size: 1.5rem;
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.4 * 1em);
    margin-bottom: 1.25rem;
  }

  &__avatar {
    background: var(--user-card__avatar--background, rgba(0, 0, 0, 0.09));
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    width: $avatar-size;
    height: $avatar-size;
    margin-left: 0.75rem;
    flex-shrink: 0;

    &__has-view {
      cursor: pointer;
    }

    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
</style>