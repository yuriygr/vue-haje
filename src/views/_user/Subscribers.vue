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
    <placeholder v-else :text="$t('user.errors.subscribers_empty')" />
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Placeholder, PlaceholderLoading, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { UsersList, UserItem, UserItemWrapper } from '@/components/user'

export default {
  name: 'user-subscribers',
  components: {
    UsersList, UserItem, UserItemWrapper,
    Placeholder, PlaceholderLoading, NButton, LoadmoreTrigger
  },
  computed: {
    ...mapState('user/subscribers', [ 'data', 'loading', 'error' ]),
    ...mapGetters('user/subscribers', [ 'hasMoreItems' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  data() {
    return { }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('user/subscribers/more')
    }
  },
  mounted() {
    this.$store.dispatch('user/subscribers/fetch')
  },
  unmounted() {
    this.$store.dispatch('user/subscribers/clear')
  }
}
</script>

<style>

</style>