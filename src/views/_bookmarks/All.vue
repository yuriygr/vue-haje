<template>
  <group v-if="data.users.length > 0 || loading">
    <n-header>{{ t('bookmarks.section.users') }}</n-header>

    <items-list type="users" v-if="data.users.length > 0 || loading" :has-data="data.users.length > 0" :loading="loading">
      <user-item v-for="item in data.users" :key="`user-short-${item.user_id}`" v-memo="[item.user_id]" :data="item" />

      <template #skeleton>
        <user-item v-for="index in 5" :key="`item-${index}`" />
      </template>
    </items-list>

    <spacer height="20" />

    <n-button component="router-link"  mode="secondary" :disabled="loading" active-class="" exact-active-class="" :to="{ name: 'bookmarks-users' }">{{ t('action.show_more') }}</n-button>
  </group>

  <group v-if="data.entries.length > 0 || loading">
    <n-header>{{ t('bookmarks.section.entries') }}</n-header>

    <items-list type="entries" :has-data="data.entries.length > 0" :loading="loading">
      <entry-item v-for="item in data.entries" :key="`entry-${item.uuid}`" v-memo="[item.uuid]" :data="item" type="short" />

      <template #skeleton>
        <entry-item v-for="index in 5" :key="`item-${index}`" />
      </template>
    </items-list>

    <spacer height="20" />

    <n-button component="router-link"  mode="secondary" :disabled="loading" active-class="" exact-active-class="" :to="{ name: 'bookmarks-entries' }">{{ t('action.show_more') }}</n-button>
  </group>

  <group v-if="data.feeds.length > 0 || loading">
    <n-header>{{ t('bookmarks.section.feeds') }}</n-header>

    <items-list type="feeds" :has-data="data.feeds.length > 0" :loading="loading">
      <feed-item v-for="item in data.feeds" :key="`feed-${item.feed_id}`" v-memo="[item.feed_id]" :data="item" />

      <template #skeleton>
        <feed-item v-for="index in 5" :key="`item-${index}`" />
      </template>
    </items-list>

    <spacer height="20" />

    <n-button component="router-link"  mode="secondary" :disabled="loading" active-class="" exact-active-class="" :to="{ name: 'bookmarks-feeds' }">{{ t('action.show_more') }}</n-button>
  </group>

  <group v-if="data.comments.length > 0 || loading">
    <n-header>{{ t('bookmarks.section.comments') }}</n-header>

    <items-list type="comments" :has-data="data.feeds.length > 0" :loading="loading">
      <comment-item v-for="item in data.comments" :key="`comment-${item.comment_id}`" v-memo="[item.comment_id]" :data="item" replyButton="link" />

      <template #skeleton>
        <comment-item v-for="index in 5" :key="`item-${index}`" />
      </template>
    </items-list>

    <spacer height="20" />

    <n-button component="router-link"  mode="secondary" :disabled="loading" active-class="" exact-active-class="" :to="{ name: 'bookmarks-comments' }">{{ t('action.show_more') }}</n-button>
  </group>

  <placeholder v-if="error"
    :icon="humanizeError(error).icon"
    :header="humanizeError(error).title"
    :text="humanizeError(error).description"
  />
  <placeholder v-else-if="emptyData && !loading"
    :icon="t('search.empty.icon')"
    :header="t('search.empty.title')"
    :text="t('search.empty.description')"
  />
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { NHeader, Placeholder, Spacer, Group, NButton } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'

import { EntryItem } from '@/components/entry'
import { CommentItem } from '@/components/comment'
import { UserItem } from '@/components/user'
import { FeedItem } from '@/components/feed'

import { useBookmarksAllStore } from '@/app/store/modules/bookmarks'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'

defineOptions({
  name: 'bookmarks-all'
})

// Composables
const { t } = useI18n()
const store = useBookmarksAllStore()
const humanizeError = useHumanizeError()
useMeta(() => ({ title: t('bookmarks.title.all') }))

// Computed
const data = computed(() => store.data)
const filters = computed(() => store.filters)
const loading = computed(() => store.loading)
const error = computed(() => store.error)

const emptyData = computed(() =>
  data.value.entries.length + data.value.users.length + data.value.comments.length + data.value.feeds.length === 0
)

// Lifecycle hooks
onMounted(() => store.fetch())
onBeforeUnmount(() => store.clear())
</script>