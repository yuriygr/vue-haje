<template>
  <template v-if="(!loading && !error) && Object.keys(data).length > 0">
    <div class="user-header">
      <div class="user-header__content-wrapper">
        <div class="user-header__content">
          <div class="user-header__name">{{ data.profile.name }}</div>
          <div class="user-header__username">@{{ data.username }}</div>
        </div>
        <div class="user-header__avatar">
          <img :src="avatarUrl(89)" alt="" />
        </div>
      </div>
      <div v-if="data.profile.bio" class="user-header__bio">{{ data.profile.bio }}</div>
      <meta-info class="user-header__meta" :items="metaItems" />
    </div>

    <spacer height="20" />
    
    <buttons-group :withGap="true" v-if="!data.state.is_me">
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

    <buttons-group :withGap="true" v-else>
      <n-button mode="secondary" component="router-link" :stretched="true" :to="{ name: 'menu' }" icon_before="menu-line">
        {{ $t('user.action.menu') }}
      </n-button>
      <n-button mode="secondary" component="router-link"  :to="{ name: 'settings' }" icon_before="settings-line">
        {{ $t('user.action.settings') }}
      </n-button>
      <icon-button component="router-link" name="logout-line" mode="secondary" :to="{ name: 'auth-logout' }" :title="$t('user.action.logout')" />
    </buttons-group>

    <separator />

    <tabs>
      <template v-for="(item, index) in tabItems" :key="`user-tab-${item.key}-${index}`">
        <tabs-item :to="item.to" :selected="item.active">{{ item.label }}</tabs-item>
      </template>
    </tabs>

    <spacer height="20" />

    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </template>

  <template v-if="Object.keys(data).length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else
      :icon="$t('errors.user_not_found.icon')"
      :header="$t('errors.user_not_found.title')"
      :text="$t('errors.user_not_found.description')"
    />
  </template>
</template>

<script>
import { mapState } from 'vuex'
import { Placeholder, PlaceholderLoading, Separator, Spacer, Icon, IconButton, NButton, Tabs, TabsItem, ButtonsGroup } from '@vue-norma/ui'

import ReportUserModal  from '@/components/modals/ReportUser'

export default {
  name: 'user',
  props: {
    username: {
      type: [ Boolean, String ],
      defalult: false
    }
  },
  components: {
    Icon, Placeholder, PlaceholderLoading, Separator, Spacer, IconButton, NButton, Tabs, TabsItem, ButtonsGroup
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('user.title'),
      },
      actions_loading: {
        unsubscribe: false,
        subscribe: false
      }
    }
  },
  computed: {
    ...mapState('user', [ 'data', 'loading', 'error' ]),
    tabItems() {
      return [
        {
          key: 'entries',
          to: { name: 'user' },
          label: this.$tc('user.tabs.entries', this.data.counters.entries),
          active: this.$route.name == `user-entries` || this.$route.name == `user` 
        },
        {
          key: 'subscribers',
          to: { name: 'user-subscribers' },
          label: this.$tc('user.tabs.subscribers', this.data.counters.subscribers),
          active: this.$route.name == `user-subscribers`
        },
        {
          key: 'subscriptions',
          to: { name: 'user-subscriptions' },
          label: this.$tc('user.tabs.subscriptions', this.data.counters.subscriptions),
          active: this.$route.name == `user-subscriptions`
        },
        {
          key: 'tags',
          to: { name: 'user-tags' },
          label: this.$tc('user.tabs.tags', this.data.counters.tags),
          active: this.$route.name == `user-tags`
        }
      ]
    },
    metaItems() {
      let _result = []

      _result.push({ label: this.$t('user.meta.from_date', { date: this.formatedDate }) })
      _result.push({ label: this.$tc('user.meta.badges', this.data.counters.badges), to: { name: 'user-badges' } })
      _result.push({ label: this.$tc('user.meta.links', this.data.counters.links), to: { name: 'user-links' } })

      return _result
    },
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    },
    formatedDate() {
      return this.$filters.timeFormatOnlyYear(this.data.meta.date_added, this.$i18n.locale)
    },
    userLink() {
      return { name: 'user', params: { username: this.data.username } }
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
    avatarUrl(size) {
      return `https://www.gravatar.com/avatar/${this.data.avatar.md5}?s=${size}&d=identicon`
    },
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
    }
  },
  mounted() {
    this.$store.dispatch('user/fetch', this.username)
  },
  unmounted() {
    this.$store.dispatch('user/clear')
  },
  watch: {
    'data'(to) {
      if (to)
        this.meta.title = `${to.profile?.name} (@${to.username})`
    },
    '$route.params.username'(to, from) {
      if (to != from) {
        this.$store.dispatch('user/fetch', to)
      }
    }
  }
}
</script>

<style lang="scss">
$avatar-size: 57px;

.user-header {
  --user-counters--color: #999;
  --user-counters--color-hover: #111;
  --user-counters__separator--color: #999;

  html[data-theme="black"] & {
    --user-counters--color: #999;
    --user-counters--color-hover: #fffcea;
    --user-counters__separator--color: #999;
  }
}

.user-header {
  --user-header--padding: 1.5rem;

  &__content-wrapper {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: var(--user-header--padding);
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
    background: rgba(0, 0, 0, 0.09);
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    width: $avatar-size;
    height: $avatar-size;
    margin-left: 0.75rem;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
</style>