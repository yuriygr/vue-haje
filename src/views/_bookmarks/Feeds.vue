<template>
  <items-list type="feeds" v-if="data.length > 0 || loading" :has-data="data.length > 0" :loading="loading" :has-more="hasMoreItems" @more="loadMore">
    <feed-item v-for="item in data" :key="`feed-${item.feed_id}`" v-memo="[item.feed_id]" :data="item" />

    <template #skeleton>
      <feed-item v-for="index in 15" :key="`item-${index}`" />
    </template>
  </items-list>

  <placeholder v-else-if="error"
    :icon="humanizeError(error).icon"
    :header="humanizeError(error).title"
    :text="humanizeError(error).description"
  />
  <placeholder v-else
    :icon="$t('bookmarks.empty.icon')"
    :header="$t('bookmarks.empty.title')"
    :text="$t('bookmarks.empty.description')"
  />
</template>

<script>
import { Placeholder } from '@vue-norma/ui'

import { FeedItem } from '@/components/feed'
import { useBookmarksFeedsStore } from '@/app/store/modules/bookmarks'
import { useHumanizeError } from '@/app/composables/useHumanizeError'

export default {
  name: 'bookmarks-feeds',
  components: {
    Placeholder, FeedItem
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('bookmarks.title.feeds')
      }
    }
  },
  setup() {
    const store = useBookmarksFeedsStore()
    const humanizeError = useHumanizeError()
    return { store, humanizeError }
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