<template>
  <div class="user-card">
    <div class="user-card__content-wrapper">
      <div class="user-card__content">
        <div class="user-card__name">{{ data.profile.name }}</div>
        <div class="user-card__username">@{{ data.username }}</div>
      </div>
      <div class="user-card__avatar user-card__avatar--has-view" @click.exact="viewAvatar">
        <img :src="avatarUrl" alt="" />
      </div>
    </div>
    <div v-if="data.profile.bio" class="user-card__bio" v-html="$filters.contentFormat(data.profile.bio)" />
    <meta-info class="user-card__meta" :items="metaItems" />
    
    <spacer height="20" />
    
    <buttons-group :withGap="true" class="user-card__actions">
      <template v-if="data.state.is_me">
        <n-button mode="secondary" component="router-link" :stretched="true" :to="{ name: 'settings-profile' }" icon_before="user-edit-line">
          {{ $t('user.action.settings') }}
        </n-button>
        <n-button component="router-link" icon_before="logout-line" mode="secondary" :to="{ name: 'auth-logout' }" :title="$t('user.action.logout')" />
      </template>
      
      <template v-else>
        <n-button
          :icon_before="data.state.me_subscribed ? 'user-follow-line' : 'user-add-line'"
          mode="secondary"
          @click.exact="toggleSubscribe"
          :disabled="loading.subscribe"
          :stretched="true"
        >
          {{ $t(data.state.me_subscribed ? 'action.unsubscribe' : 'action.subscribe') }}
        </n-button>
        <n-button icon_before="ui-more" mode="secondary" @click.exact="toggleOptions" ref="options" :title="$t('action.options')" />
      </template>
    </buttons-group>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { NButton, ButtonsGroup, MetaInfo, Spacer } from '@vue-norma/ui'

let UserAvatarView = defineAsyncComponent(() => import("@/components/modals/_user/AvatarView.vue"))
let UserReportModal = defineAsyncComponent(() => import("@/components/modals/_user/Report.vue"))

export default {
  name: 'user-card',
  components: {
    NButton, ButtonsGroup, MetaInfo, Spacer
  },
  props: {
    data: false
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
    avatarUrl() {
      let size = 100

      return `https://www.gravatar.com/avatar/${this.data.avatar.hash}?s=${size}&d=identicon`
    },
    metaItems() {
      let _result = []

      _result.push({ label: this.$t('user.meta.from_date', { date: this.formatedDate }) })

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
          label: this.$t('action.remove-bookmark'),
          action: this.toggleBookmarks
        } : {
          icon: 'ui-bookmark-add',
          label: this.$t('action.add-bookmark'),
          action: this.toggleBookmarks
        }
      ]

      return [
        ...(this.data.state.is_me) ? [] : _notify,
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
        ? `user/${this.data.username}/unsubscribe`
        : `user/${this.data.username}/subscribe`
      this.$api.post(_path)
      .then(result => {
        this.data.state.me_subscribed = (result.status == 'subscribed')
        result.status == 'subscribed'
          ? this.data.counters.subscribers += 1
          : this.data.counters.subscribers -= 1
      })
      .catch(error => this.$alerts.danger({ text: error.status }))
      .then(_ => this.loading.subscribe = false)
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
      this.loading.bookmarks = true
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
      .then(_ => this.loading.bookmarks = false)
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
      this.$modals.show(UserReportModal, {
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
    --user-card__username--color: var(--x-color-white--shade40, #999);
    --user-card__avatar--background: rgba(255, 255, 255, 0.09);
  }
}

.user-card {
  --user-card--padding: 1.5rem;

  &__content-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin-bottom: var(--user-card--padding);
  }

  &__content {
    display: flex;
    flex-direction: column;
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
    color: var(--user-card__username--color);
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.4 * 1em);
  }

  &__bio {
    font-size: 1.5rem;
    line-height: calc(1.4 * 1em);
    word-break: break-word;
    -webkit-font-smoothing: subpixel-antialiased;
    margin-bottom: 1rem;
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