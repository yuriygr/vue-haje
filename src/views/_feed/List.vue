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
    :icon="$t('errors.empty_feeds.icon')"
    :header="$t('errors.empty_feeds.title')"
    :text="$t('errors.empty_feeds.description')"
  />
</template>

<script>
import { Placeholder } from '@vue-norma/ui'

import { FeedItem } from '@/components/feed'
import { useFeedFeedsStore } from '@/app/components/stores/modules/feed'
import { useHumanizeError } from '@/app/composables/useHumanizeError'

export default {
  name: 'feed-feeds',
  components: {
    Placeholder, FeedItem
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('feed.tabs.feeds')
      }
    }
  },
  setup() {
    const store = useFeedFeedsStore()
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
  },
}
</script>
