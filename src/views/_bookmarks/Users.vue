<template>
  <group v-if="(!loading && !error) || data.length > 0">
    <users-list>
      <user-item-wrapper v-for="item in data" :key="`user-short-${item.user_id}`">
        <user-item :data="item" />
      </user-item-wrapper>
      
      <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

      <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
    </users-list>
  </group>

  <template v-if="data.length == 0">
    <users-list v-if="loading">
      <user-item-wrapper v-for="index in skeletons" :key="`item-${index}`">
        <user-item />
      </user-item-wrapper>
    </users-list>
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else
      :icon="$t('errors.empty_bookmarks.icon')"
      :header="$t('errors.empty_bookmarks.title')"
      :text="$t('errors.empty_bookmarks.description')"
    />
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Group, Placeholder, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { UsersList, UserItem, UserItemWrapper } from '@/components/user'

export default {
  name: 'bookmarks-users',
  components: {
    UsersList, UserItem, UserItemWrapper,
    Group, Placeholder, NButton, LoadmoreTrigger
  },
  computed: {
    ...mapState('app', [ 'skeletons' ]),
    ...mapState('bookmarks/users', [ 'data', 'loading', 'error' ]),
    ...mapGetters('bookmarks/users', [ 'hasMoreItems' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  data() {
    return { }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('bookmarks/users/more')
    }
  },
  mounted() {
    this.$store.dispatch('bookmarks/users/fetch')
  },
  beforeUnmount() {
    this.$store.dispatch('bookmarks/users/clear')
  },
  watch: {
    async '$route.query.q'(to) {
      await this.$store.dispatch('bookmarks/users/setFilters', { offset: undefined })
      this.$store.dispatch('bookmarks/users/fetch')
    }
  }
}
</script>

<style>

</style>