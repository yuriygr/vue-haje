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

<script>
import { NHeader, Placeholder, PlaceholderLoading, Separator, Spacer, Group, NButton } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'

import { EntryItem } from '@/components/entry'
import { CommentItem } from '@/components/comment'
import { UserItem } from '@/components/user'
import { FeedItem } from '@/components/feed'

import { useBookmarksAllStore } from '@/app/store/modules/bookmarks'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'

export default {
  name: 'bookmarks-all',
  components: {
    NHeader,
    Placeholder, PlaceholderLoading, Separator, Spacer,
    Group, NButton,
    UserItem,
    EntryItem,
    CommentItem,
    FeedItem
  },
  setup() {
    const { t } = useI18n()
    const store = useBookmarksAllStore()
    const humanizeError = useHumanizeError()

    useMeta(() => ({ title: t('bookmarks.title.all') }))

    return { t, store, humanizeError }
  },
  computed: {
    data()         { return this.store.data },
    filters()      { return this.store.filters },
    loading()      { return this.store.loading },
    error()        { return this.store.error },
    emptyData()    {
      return (
        this.data.entries.length + this.data.users.length + this.data.comments.length + this.data.feeds.length
      ) == 0
    },
  },
  methods: {
    formatLink(tab = false) {
      return { name: `bookmarks-${tab}`}
    },
  },
  mounted() {
    this.store.fetch()
  },
  beforeUnmount() {
    this.store.clear()
  }
}
</script>