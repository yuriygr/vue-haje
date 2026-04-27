<template>
  <badges-list v-if="data.length > 0 || loading">
    <template v-if="data.length > 0">
      <badge-item-wrapper v-for="item in data" :key="`badge-${item.badge_id}`" v-memo="[item.badge_id]">
        <badge-item :data="item" />
      </badge-item-wrapper>
      
      <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />
      <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
    </template>

    <template v-else-if="loading">
      <badge-item-wrapper v-for="index in 5" :key="`item-${index}`">
        <badge-item />
      </badge-item-wrapper>
    </template>
  </badges-list>

  <placeholder v-else-if="error"
    :icon="$t($filters.humanizeError(error).icon)"
    :header="$t($filters.humanizeError(error).title)"
    :text="$t($filters.humanizeError(error).description)"
  />
  <placeholder v-else :text="$t('user.errors.badges_empty')" />
</template>

<script>
import { Placeholder, PlaceholderLoading, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { BadgesList, BadgeItem, BadgeItemWrapper } from '@/components/badge'
import { useUserBadgesStore } from '@/app/components/stores/modules/user'

export default {
  name: 'user-badges',
  props: {
    username: {
      type: [ Boolean, String ],
      default: false
    }
  },
  components: {
    Placeholder, PlaceholderLoading, NButton, LoadmoreTrigger,
    BadgesList, BadgeItem, BadgeItemWrapper
  },
  setup() {
    const store = useUserBadgesStore()
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