<template>
  <template v-if="(!loading && !error) && !isEmpty">
    <user-card :data="data" />

    <spacer height="15" />

    <tabs>
      <template v-for="item in tabItems" :key="`user-tab-${item.key}`">
        <tabs-item :to="item.to" :selected="item.active">{{ item.label }}</tabs-item>
      </template>
    </tabs>

    <spacer height="30" />

    <router-view v-slot="{ Component }" name="user">
      <keep-alive>
        <component :is="Component" :username="username" />
      </keep-alive>
    </router-view>
  </template>

  <template v-if="isEmpty">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="humanizeError(error).icon"
      :header="humanizeError(error).title"
      :text="humanizeError(error).description"
    />
  </template>
</template>

<script setup>
// Imports
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Placeholder, PlaceholderLoading, Spacer, Tabs, TabsItem } from '@vue-norma/ui'
import { storeToRefs } from 'pinia'

import { UserCard } from '@/components/user'
import { useUserStore } from '@/app/store/modules/user'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'

defineOptions({ name: 'user' })

// Props
const props = defineProps({
  username: {
    type: [Boolean, String],
    default: false
  }
})

// Composables
const { t } = useI18n()
const route = useRoute()
const store = useUserStore()
const humanizeError = useHumanizeError()
const { data, loading, error, isEmpty } = storeToRefs(store)
const { setTitle } = useMeta(() => ({ title: t('user.title') }))

// Computed
const tabItems = computed(() => [
  {
    key: 'entries',
    to: { name: 'user', params: { username: props.username } },
    label: t('user.tabs.entries', data.value.counters.entries),
    active: route.name == 'user-entries' || route.name == 'user'
  },
  {
    key: 'subscribers',
    to: { name: 'user-subscribers', params: { username: props.username } },
    label: t('user.tabs.subscribers', data.value.counters.subscribers),
    active: route.name == 'user-subscribers'
  },
  {
    key: 'subscriptions',
    to: { name: 'user-subscriptions', params: { username: props.username } },
    label: t('user.tabs.subscriptions', data.value.counters.subscriptions),
    active: route.name == 'user-subscriptions'
  },
  {
    key: 'badges',
    to: { name: 'user-badges', params: { username: props.username } },
    label: t('user.tabs.badges', data.value.counters.badges),
    active: route.name == 'user-badges'
  },
])

// Watchers
watch(() => props.username, (to) => {
  if (to) {
    store.clear()
    store.fetch(to)
  }
})

watch(data, (to) => {
  if (to.profile?.name && to.username)
    setTitle(`${to.profile.name} (@${to.username})`)
}, { immediate: true })

watch(error, (to) => {
  if (to) setTitle(humanizeError(to).title)
})

// Lifecycle hooks
onMounted(() => store.fetch(props.username))
onBeforeUnmount(() => store.clear())
</script>