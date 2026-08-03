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
    :icon="$t('errors.empty_feed.icon')"
    :header="$t('errors.empty_feed.title')"
    :text="$t('errors.empty_feed.description')"
  />
</template>

<script>
import { Placeholder } from '@vue-norma/ui'

import { EntryItem } from '@/components/entry'
import { useCustomFeedEntries } from '@/app/store/modules/custom_feed'
import { useHumanizeError } from '@/app/composables/useHumanizeError'

export default {
  name: 'custom-feed-entries',
  props: {
    uuid: {
      type: [ Boolean, String ],
      default: false
    }
  },
  components: {
    Placeholder, EntryItem
  },
  setup() {
    const store = useCustomFeedEntries()
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
      this.store.more(this.uuid)
    }
  },
  mounted() {
    this.store.fetch(this.uuid)
  },
  beforeUnmount() {
    this.store.clear()
  }
}
</script>