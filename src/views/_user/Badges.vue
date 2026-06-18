<template>
  <items-list type="badges" v-if="data.length > 0 || loading" :has-data="data.length > 0" :loading="loading" :has-more="hasMoreItems" @more="loadMore">
    <badge-item v-for="item in data" :key="`badge-${item.badge_id}`" v-memo="[item.badge_id]" :data="item" />

    <template #skeleton>
      <badge-item v-for="index in 5" :key="`item-${index}`" />
    </template>
  </items-list>

  <placeholder v-else-if="error"
    :icon="humanizeError(error).icon"
    :header="humanizeError(error).title"
    :text="humanizeError(error).description"
  />
  <placeholder v-else :text="$t('user.errors.badges_empty')" />
</template>

<script>
import { Placeholder } from '@vue-norma/ui'

import { BadgeItem } from '@/components/badge'
import { useUserBadgesStore } from '@/app/components/stores/modules/user'
import { useHumanizeError } from '@/app/composables/useHumanizeError'

export default {
  name: 'user-badges',
  props: {
    username: {
      type: [ Boolean, String ],
      default: false
    }
  },
  components: {
    BadgeItem, Placeholder
  },
  setup() {
    const store = useUserBadgesStore()
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