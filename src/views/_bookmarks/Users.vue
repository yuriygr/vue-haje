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

<script>
import { Placeholder } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'

import { UserItem } from '@/components/user'
import { useBookmarksUsersStore } from '@/app/store/modules/bookmarks'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'

export default {
  name: 'bookmarks-users',
  components: {
    Placeholder, UserItem
  },
  setup() {
    const { t } = useI18n()
    const store = useBookmarksUsersStore()
    const humanizeError = useHumanizeError()

    useMeta(() => ({ title: t('bookmarks.title.users') }))

    return { t, store, humanizeError }
  },
  computed: {
    data()         { return this.store.data },
    filters()      { return this.store.filters },
    loading()      { return this.store.loading },
    error()        { return this.store.error },
    hasMoreItems() { return this.store.hasMoreItems },
  },
  methods: {
    loadMore() {
      this.store.more()
    }
  },
  mounted() {
    this.store.fetch()
  },
  beforeUnmount() {
    this.store.clear()
  }
}
</script>