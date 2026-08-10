<template>
  <items-list type="users" v-if="data.length > 0 || loading" :has-data="data.length > 0" :loading="loading" :has-more="hasMoreItems" @more="loadMore">
    <user-item v-for="item in data" :key="`user-short-${item.user_id}`" v-memo="[item.user_id]" :data="item" />

    <template #skeleton>
      <user-item v-for="index in 15" :key="`item-${index}`" />
    </template>
  </items-list>

  <placeholder v-else-if="error"
    :icon="humanizeError(error).icon"
    :header="humanizeError(error).title"
    :text="humanizeError(error).description"
  />
  <placeholder v-else
    :icon="t('bookmarks.empty.icon')"
    :header="t('bookmarks.empty.title')"
    :text="t('bookmarks.empty.description')"
  />
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { Placeholder } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

import { UserItem } from '@/components/user'
import { useBookmarksUsersStore } from '@/app/store/modules/bookmarks'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'

defineOptions({
  name: 'bookmarks-users'
})

// Composables
const { t } = useI18n()
const store = useBookmarksUsersStore()
const humanizeError = useHumanizeError()
const { data, loading, error, hasMoreItems } = storeToRefs(store)
useMeta(() => ({ title: t('bookmarks.title.users') }))

// Methods
function loadMore() {
  store.more()
}

// Lifecycle hooks
onMounted(() => store.fetch())
onBeforeUnmount(() => store.clear())
</script>