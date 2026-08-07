<template>
  <items-list type="entries" v-if="data.length > 0 || loading" :has-data="data.length > 0" :loading="loading" :has-more="hasMoreItems" @more="loadMore">
    <entry-item v-for="item in data" :key="`entry-${item.uuid}`" v-memo="[item.uuid]" :data="item" />

    <template #skeleton>
      <entry-item v-for="index in 15" :key="`item-${index}`" />
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

import { EntryItem } from '@/components/entry'
import { useBookmarksEntriesStore } from '@/app/store/modules/bookmarks'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'

export default {
  name: 'bookmarks-entries',
  components: {
    Placeholder, EntryItem
  },
  setup() {
    const { t } = useI18n()
    const store = useBookmarksEntriesStore()
    const humanizeError = useHumanizeError()

    useMeta(() => ({ title: t('bookmarks.title.entries') }))

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