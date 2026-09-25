<template>
  <buttons-group :withGap="true">
    <n-button mode="secondary" @click.exact="readAll" size="l" :stretched="true" :disabled="readall_loading">{{ t('notifications.action.read_all') }}</n-button>
    <n-button component="router-link" icon_before="settings-line" size="l" mode="secondary" :to="{ name: 'settings-notifications' }" :title="t('notifications.action.settings')" />
  </buttons-group>
  
  <spacer height="15" />

  <tabs>
    <template v-for="item in tabItems" :key="`notification-tab-${item.key}`">
      <tabs-item :to="item.to" :selected="item.key === filters.tab">{{ item.label }}</tabs-item>
    </template>
  </tabs>

  <spacer height="30" />

  <items-list type="notifications" v-if="data.length > 0 || loading" :has-data="data.length > 0" :loading="loading" :has-more="hasMoreItems" @more="loadMore">
    <notification-item v-for="item in data" :key="`notification-${item.notify_id}`" v-memo="[item.state.is_readed]" :data="item" />

    <template #skeleton>
      <notification-item v-for="index in 15" :key="`item-${index}`" />
    </template>
  </items-list>

  <placeholder v-else-if="error"
    :icon="humanizeError(error).icon"
    :header="humanizeError(error).title"
    :text="humanizeError(error).description"
  />
  <placeholder v-else
    :icon="t('notifications.empty.icon')"
    :header="t('notifications.empty.title')"
    :text="t('notifications.empty.description')"
  />
</template>

<script setup>
import { watch, computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Tabs, TabsItem, Placeholder, Spacer, NButton, ButtonsGroup } from '@vue-norma/ui'

import { to } from '@/app/services/utilities'
import { NotificationItem } from '@/components/notifications'
import { useNotificationsStore } from '@/app/store/modules/notifications'
import { useAuthStore } from '@/app/store/modules/auth'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'
import { useToast } from '@/app/composables/useToast'
import { useBus } from '@/app/composables/useBus'

// Composables
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useNotificationsStore()
const authStore = useAuthStore()
const humanizeError = useHumanizeError()
const toast = useToast()
const bus = useBus()

useMeta(() => ({ title: t('notifications.title') }))

// Stte
const readall_loading = ref(false)

// Computed
const data = computed(() => store.data)
const filters = computed(() => store.filters)
const loading = computed(() => store.loading)
const error = computed(() => store.error)
const hasMoreItems = computed(() => store.hasMoreItems)

const tabItems = computed(() => [
  { key: 'all',          to: formatLink(),               label: t('notifications.tabs.all') },
  { key: 'subscription', to: formatLink('subscription'), label: t('notifications.tabs.subscriptions') },
  { key: 'comment',      to: formatLink('comment'),      label: t('notifications.tabs.comments') },
  { key: 'reply',        to: formatLink('reply'),        label: t('notifications.tabs.replies') },
  { key: 'mention',      to: formatLink('mention'),      label: t('notifications.tabs.mentions') },
  { key: 'new_post',     to: formatLink('new_post'),     label: t('notifications.tabs.new_post') },
  { key: 'system',       to: formatLink('system'),       label: t('notifications.tabs.system') }
])

const availableKeys = computed(() => tabItems.value.map(el => el.key))

// Methods
function formatLink(tab = false) {
  return tab
    ? { name: route.name, query: { tab } }
    : { name: route.name }
}

async function seen() {
  const [err] = await to(store.seen())
  err
    ? toast.danger(t(`alerts.${err.status}`))
    : authStore.seenNotifications()
}

async function readAll() {
  readall_loading.value = true

  const [err, result] = await to(store.readAll())
  err
    ? toast.danger(t(`alerts.${err.status}`))
    : toast.success(t(`alerts.${result.status}`))

  readall_loading.value = false
}

function loadMore() {
  store.more()
}

function onHasNotice(payload) {
  payload && store.loadNew()
}

// Watch
watch(
  () => route.query.tab,
  (to) => {
    const tab = availableKeys.value.includes(to) ? to : 'all'
    if (tab === filters.value.tab) return // Проверка на дубликаты

    store.setFilters({ tab, offset: undefined })
    store.fetch()
  },
  { immediate: false }
)

// Lifecycle hooks
onMounted(() => {
  seen()

  const tab = availableKeys.value.includes(route.query.tab)
    ? route.query.tab
    : 'all'

  bus.on('app:has_notice', onHasNotice)
  store.setFilters({ tab, offset: undefined })
  store.fetch()
})

onBeforeUnmount(() => {
  bus.off('app:has_notice', onHasNotice)
  store.clear()
})
</script>