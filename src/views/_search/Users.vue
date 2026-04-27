<template>
  <users-list v-if="data.length > 0 || loading">
    <template v-if="data.length > 0">
      <user-item-wrapper v-for="item in data" :key="`user-short-${item.user_id}`" v-memo="[item.user_id]">
        <user-item :data="item" />
      </user-item-wrapper>
      
      <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />
      <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
    </template>
 
    <template v-else-if="loading">
      <user-item-wrapper v-for="index in 15" :key="`item-${index}`">
        <user-item />
      </user-item-wrapper>
    </template>
  </users-list>

  <placeholder v-else-if="error"
    :icon="$t($filters.humanizeError(error).icon)"
    :header="$t($filters.humanizeError(error).title)"
    :text="$t($filters.humanizeError(error).description)"
  />
  <placeholder v-else
    :icon="$t('search.empty.icon')"
    :header="$t('search.empty.title')"
    :text="$t('search.empty.description')"
  />
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Placeholder, NHeader, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { UsersList, UserItem, UserItemWrapper } from '@/components/user'

export default {
  name: 'search-users',
  components: {
    UsersList, UserItem, UserItemWrapper,
    Placeholder, NHeader, NButton, LoadmoreTrigger
  },
  computed: {
    ...mapState('search/users', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('search/users', [ 'hasMoreItems', 'emptyQuery', 'searching' ])
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('search.title.users')
      }
    }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('search/users/more')
    }
  },
 async mounted() {
    await this.$store.dispatch('search/users/setFilters', {
      query: this.$route.query.q, offset: undefined
    })
    await this.$store.dispatch('search/users/fetch')
  },
  beforeUnmount() {
    this.$store.dispatch('search/users/clear')
  },
  watch: {
    async '$route.query.q'(to) {
      await this.$store.dispatch('search/users/setFilters', { query: to, offset: undefined })
      await this.$store.dispatch('search/users/fetch')
    }
  }
}
</script>