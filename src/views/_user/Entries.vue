<template>
  <entries-list v-if="(!loading && !error) || data.length > 0">
    <entry-item-wrapper v-for="item in data" :key="`entry-${item.uuid}`" v-memo="[item.uuid]">
      <entry-item :data="item" type="short" :showPinAction="true" />
    </entry-item-wrapper>

    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </entries-list>

  <template v-if="data.length == 0">
    <entries-list v-if="loading">
      <entry-item-wrapper v-for="index in 15" :key="`item-${index}`">
        <entry-item type="short" />
      </entry-item-wrapper>
    </entries-list>
    <placeholder v-else-if="error"
      :icon="$t($filters.humanizeError(error).icon)"
      :header="$t($filters.humanizeError(error).title)"
      :text="$t($filters.humanizeError(error).description)"
    />
    <placeholder v-else :text="$t('user.errors.entries_empty')" />
  </template>
</template>

<script>
import { Placeholder, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { EntriesList, EntryItem, EntryItemWrapper } from '@/components/entry'
import { useUserEntriesStore } from '@/app/components/stores/modules/user'

export default {
  name: 'user-entries',
  props: {
    username: {
      type: [ Boolean, String ],
      default: false
    }
  },
  components: {
    EntriesList, EntryItem, EntryItemWrapper,
    Placeholder, NButton, LoadmoreTrigger
  },
  setup() {
    const store = useUserEntriesStore()
    return { store }
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
      this.store.more(this.username)
    }
  },
  mounted() {
    this.store.fetch(this.username)
  },
  beforeUnmount() {
    this.store.clear()
  }
}
</script>