<template>
  <router-link v-if="authData.user" :to="{ name: 'user', params: { username: authData.user.username } }" class="user-item-button">
    <user-item :data="authData.user" :clickable="false" :showSubscribeAction="false" />
    <div class="user-item-button__chevron">
      <icon name="chevron-line" size="18" />
    </div>
  </router-link>

  <spacer height="15" />

  <template v-for="(section, index) in menu" :key="`section-${index}`">
    <navigation-section>
      <template v-for="(item, jndex) in section.items" :key="`section-${index}-item-${jndex}`">
        <navigation-item :icon="item.icon" :to="item.to" :chevron="item.chevron" :disabled="item.disabled">
          {{ item.label }}
        </navigation-item>
      </template>
    </navigation-section>
  </template>
</template>

<script setup>
// Imports
import { computed } from 'vue'
import { NavigationSection, NavigationItem, Icon, Spacer } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'

import { UserItem } from '@/components/user'
import { useAuthStore } from '@/app/store/modules/auth'
import { useMeta } from '@/app/composables/useMeta'

// Composables
const { t } = useI18n()
const authStore = useAuthStore()

useMeta(() => ({ title: t('menu.title') }))

// Computed
const authData = computed(() => authStore.data)
const isAuth = computed(() => authStore.isAuth)

const sections = computed(() => [
  {
    icon: 'feeds-line',
    label: t('menu.item.feeds'),
    to: { name: 'feeds' },
    disabled: !isAuth.value,
    chevron: true
  },
  {
    icon: 'bookmarks-line',
    label: t('menu.item.bookmarks'),
    to: { name: 'bookmarks' },
    disabled: !isAuth.value,
    chevron: true
  },
  {
    icon: 'settings-line',
    label: t('menu.item.settings'),
    to: { name: 'settings' },
    chevron: true
  },
  {
    icon: 'charity-line',
    label: t('menu.item.donate'),
    to: { name: 'donate' },
    chevron: true
  }
])

const main = computed(() => [
  {
    icon: 'support-line',
    label: t('menu.item.support'),
    to: { name: 'support' },
    disabled: !isAuth.value,
    chevron: true
  },
  {
    icon: 'help-line',
    label: t('menu.item.help'),
    to: { name: 'helps' },
    chevron: true
  },
  {
    icon: 'about-line',
    label: t('menu.item.about'),
    to: { name: 'about' },
    chevron: true
  }
])

const last = computed(() => [
  isAuth.value ? {
    icon: 'logout-line',
    label: t('menu.item.logout'),
    to: { name: 'auth-logout' },
    chevron: false
  } : {
    icon: 'login-line',
    label: t('menu.item.login'),
    to: { name: 'auth-login' },
    chevron: true
  }
])

const menu = computed(() => [
  { items: sections.value },
  { items: main.value },
  { items: last.value }
])
</script>

<style lang="scss">
.user-item-button {
  --user-item-button--background: transparent;
  --user-item-button--background-hover: #f1f3f5;
  --user-item-button__chevron--color: #adb5bd;
  --user-item-button__chevron--color-hover: #212529;

  html[data-theme="black"] & {
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