<template>
  <router-link v-if="session_data.user" :to="{ name: 'user', params: { username: session_data.user.username } }" class="user-item-button">
    <user-item :data="session_data.user"  :clickable="false" :showSubscribeAction="false" />
    <div class="user-item-button__chevron">
      <icon name="chevron-line" size="18" />
    </div>
  </router-link>

  <spacer height="15" />

  <template v-for="(section, index) in sections" :key="`section-${index}`">
    <navigation-section>
      <template v-for="(item, jndex) in section.items" :key="`section-${index}-item-${jndex}`">
        <navigation-item :icon="item.icon" :to="item.to" :chevron="item.chevron" :disabled="item.disabled">
          {{ item.label }}
        </navigation-item>
      </template>
    </navigation-section>
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { NavigationSection, NavigationItem, Icon, Spacer } from '@vue-norma/ui'

import { UserItem } from '@/components/user'

export default {
  name: 'menu',
  components: {
    UserItem,
    NavigationSection, NavigationItem, Icon, Spacer
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('menu.title')
      }
    }
  },
  computed: {
    ...mapGetters('auth', [ 'isAuth' ]),
    ...mapState('auth', {
      'session_data': state => state.data
    }),
    sections() {
      let sections = [
        {
          icon: 'feeds-line',
          label: this.$t('menu.item.feeds'),
          to: { name: 'feeds' },
          disabled: !this.isAuth,
          chevron: true
        },
        {
          icon: 'bookmarks-line',
          label: this.$t('menu.item.bookmarks'),
          to: { name: 'bookmarks' },
          disabled: !this.isAuth,
          chevron: true
        },
        {
          icon: 'settings-line',
          label: this.$t('menu.item.settings'),
          to: { name: 'settings' },
          chevron: true
        }
      ]

      let main = [
        {
          icon: 'charity-line',
          label: this.$t('menu.item.donate'),
          to: { name: 'donate' },
          chevron: true
        },
        {
          icon: 'help-line',
          label: this.$t('menu.item.help'),
          to: { name: 'helps' },
          chevron: true
        },
        {
          icon: 'about-line',
          label: this.$t('menu.item.about'),
          to: { name: 'about' },
          chevron: true
        }
      ]

      let last = [
        this.session_data.is_auth ? {
          icon: 'logout-line',
          label: this.$t('menu.item.logout'),
          to: { name: 'auth-logout' },
          chevron: false
        } : {
          icon: 'login-line',
          label: this.$t('menu.item.login'),
          to: { name: 'auth-login' },
          chevron: true
        }
      ]

      return [
        { items: sections },
        { items: main },
        { items: last }
      ]
    }
  }
}
</script>

<style lang="scss">
.user-item-button {
  --user-item-button--background: transparent;
  --user-item-button--background-hover: #f1f3f5;
  --user-item-button__chevron--color: #adb5bd;
  --user-item-button__chevron--color-hover: #212529;

  html[data-theme='black'] & {
    --user-item-button--background: transparent;
    --user-item-button--background-hover: #1f1f1f;
    --user-item-button__chevron--color: #666;
    --user-item-button__chevron--color-hover: #888;
  }
}

.user-item-button {
  $parent: &;

  background: var(--user-item-button--background, transparent);
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin: 0;
  cursor: pointer;
  transition: var(--x-transition);

  &__chevron {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--user-item-button__chevron--color);

    svg { display: block; fill: currentColor; }

    @media(hover: hover) {
      #{$parent}:hover > & {
        color: var(--user-item-button__chevron--color-hover);
      }
    }
  }

  @media(hover: hover) {
    &:hover {
      background: var(--user-item-button--background-hover);
      text-decoration: none;
    }
  }
}
</style>