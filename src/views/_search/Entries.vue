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
    :icon="$t('search.empty.icon')"
    :header="$t('search.empty.title')"
    :text="$t('search.empty.description')"
  />
</template>

<script>
import { Placeholder } from '@vue-norma/ui'

import { EntryItem } from '@/components/entry'
import { useSearchEntriesStore } from '@/app/components/stores/modules/search'
import { useHumanizeError } from '@/app/composables/useHumanizeError'

export default {
  name: 'search-entries',
  components: {
    Placeholder, EntryItem
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('search.title.entries')
      }
    }
  },
  setup() {
    const store = useSearchEntriesStore()
    const humanizeError = useHumanizeError()
    return { store, humanizeError }
  },
  computed: {
    data()         { return this.store.data },
    filters()      { return this.store.filters },
    loading()      { return this.store.loading },
    error()        { return this.store.error },
    hasMoreItems() { return this.store.hasMoreItems },

    // TODO: Понять зачем это 
    emptyQuery() {
      return this.store.filters.query === ''
    },
    searching() {
      return this.store.filters.query != ''
    }
  },
  methods: {
    loadMore() {
      this.store.more()
    }
  },
  mounted() {
    this.store.setFilters({
      query: this.$route.query.q, offset: undefined
    })
    this.store.fetch()
  },
  beforeUnmount() {
    this.store.clear()
  },
  watch: {
    '$route.query.q'(to) {
      this.store.setFilters({
        query: to, offset: undefined
      })
      this.store.fetch()
    }
  }
}
</script>