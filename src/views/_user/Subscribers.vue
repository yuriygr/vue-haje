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
  <placeholder v-else :text="$t('user.errors.subscribers_empty')" />
</template>

<script>
import { Placeholder, NButton, LoadmoreTrigger } from '@vue-norma/ui'

import { UserItem } from '@/components/user'
import { useUserSubscribersStore } from '@/app/components/stores/modules/user'
import { useHumanizeError } from '@/app/composables/useHumanizeError'

export default {
  name: 'user-subscribers',
  props: {
    username: {
      type: [ Boolean, String ],
      default: false
    }
  },
  components: {
    UserItem, Placeholder
  },
  setup() {
    const store = useUserSubscribersStore()
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