<template>
  <tabs>
    <template v-for="item in tabItems" :key="`bookmarks-tab-${item.key}`">
      <tabs-item :to="item.to" :selected="item.key === $route.meta.key">{{ item.label }}</tabs-item>
    </template>
  </tabs>

  <spacer height="30" />

  <router-view v-slot="{ Component }" name="bookmarks">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup>
// Imports
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Tabs, TabsItem, Spacer } from '@vue-norma/ui'

// Composables
const { t } = useI18n()
const route = useRoute()

// Methods
const formatLink = (tab = false) => {
  const { q } = route.query
  return tab
    ? { name: `bookmarks-${tab}`, query: { q } }
    : { name: 'bookmarks', query: { q } }
}

// Computed
const tabItems = computed(() => [
  { key: 'all',      to: formatLink(),           label: t('bookmarks.tabs.all') },
  { key: 'users',    to: formatLink('users'),    label: t('bookmarks.tabs.users') },
  { key: 'entries',  to: formatLink('entries'),  label: t('bookmarks.tabs.entries') },
  { key: 'comments', to: formatLink('comments'), label: t('bookmarks.tabs.comments') },
  { key: 'feeds',    to: formatLink('feeds'),    label: t('bookmarks.tabs.feeds') },
])
</script>