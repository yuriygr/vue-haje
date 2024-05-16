<template>
  <users-list v-if="(!loading && !error) || data.length > 0">
    <user-item-wrapper v-for="item in data" :key="`user-short-${item.user_id}`">
      <user-item :data="item" />
    </user-item-wrapper>
    
    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </users-list>

  <template v-if="data.length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else
      :icon="$t('errors.empty_search.icon')"
      :header="$t('errors.empty_search.title')"
      :text="$t('errors.empty_search.description')"
    />
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Placeholder, PlaceholderLoading, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { UsersList, UserItem, UserItemWrapper } from '@/components/user'

export default {
  name: 'search-users',
  components: {
    UsersList, UserItem, UserItemWrapper,
    Placeholder, PlaceholderLoading, NButton, LoadmoreTrigger
  },
  computed: {
    ...mapState('search/users', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('search/users', [ 'hasMoreItems', 'emptyQuery', 'searching' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
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
    this.$store.dispatch('search/users/fetch')
  },
  unmounted() {
    this.$store.dispatch('search/users/clear')
  },
  watch: {
    async '$route.query.q'(to) {
      await this.$store.dispatch('search/users/setFilters', { query: to, offset: undefined })
      this.$store.dispatch('search/users/fetch')
    }
  }
}
</script>

<style>

</style>