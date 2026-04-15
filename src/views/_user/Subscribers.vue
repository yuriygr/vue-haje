<template>
  <users-list v-if="(!loading && !error) || data.length > 0">
    <user-item-wrapper v-for="item in data" :key="`user-short-${item.user_id}`" v-memo="[item.user_id]">
      <user-item :data="item" />
    </user-item-wrapper>
    
    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </users-list>

  <template v-if="data.length == 0">
    <users-list v-if="loading">
      <user-item-wrapper v-for="index in 15" :key="`item-${index}`">
        <user-item />
      </user-item-wrapper>
    </users-list>
    <placeholder v-else-if="error"
      :icon="$t($filters.humanizeError(error).icon)"
      :header="$t($filters.humanizeError(error).title)"
      :text="$t($filters.humanizeError(error).description)"
    />
    <placeholder v-else :text="$t('user.errors.subscribers_empty')" />
  </template>
</template>

<script>
import { Placeholder, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { UsersList, UserItem, UserItemWrapper } from '@/components/user'
import { useUserSubscribersStore } from '@/app/components/stores/modules/user'

export default {
  name: 'user-subscribers',
  props: {
    username: {
      type: [ Boolean, String ],
      default: false
    }
  },
  components: {
    UsersList, UserItem, UserItemWrapper,
    Placeholder, NButton, LoadmoreTrigger
  },
  setup() {
    const store = useUserSubscribersStore()
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