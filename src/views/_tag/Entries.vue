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
  <placeholder v-else :text="$t('tag.errors.entries_empty')" />
</template>

<script>
import { Placeholder } from '@vue-norma/ui'

import { EntryItem } from '@/components/entry'
import { useTagEntriesStore } from '@/app/store/modules/tag'
import { useHumanizeError } from '@/app/composables/useHumanizeError'

export default {
  name: 'tag-entries',
  props: {
    slug: {
      type: [ Boolean, String ],
      default: false
    }
  },
  components: {
    Placeholder, EntryItem
  },
  setup() {
    const store = useTagEntriesStore()
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
      this.store.more(this.slug)
    }
  },
  mounted() {
    this.store.fetch(this.slug)
  },
  beforeUnmount() {
    this.store.clear()
  }
}
</script>