<template>
  <users-list v-if="(!loading && !error) || data.length > 0">
    <user-item-wrapper v-for="item in data" :key="`user-short-${item.user_id}`">
      <user-item :data="item" />
    </user-item-wrapper>

    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </users-list>

  <template v-if="data.length == 0">
    <users-list v-if="loading">
      <user-item-wrapper v-for="item in skeletons">
        <user-item />
      </user-item-wrapper>
    </users-list>
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else :text="$t('user.errors.subscriptions_empty')" />
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Placeholder, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { UsersList, UserItem, UserItemWrapper } from '@/components/user'

export default {
  name: 'user-subscriptions',
  components: {
    UsersList, UserItem, UserItemWrapper,
    Placeholder, NButton, LoadmoreTrigger
  },
  computed: {
    ...mapState('app', [ 'skeletons' ]),
    ...mapState('user/subscriptions', [ 'data', 'loading', 'error' ]),
    ...mapGetters('user/subscriptions', [ 'hasMoreItems' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  data() {
    return { }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('user/subscriptions/more')
    }
  },
  mounted() {
    this.$store.dispatch('user/subscriptions/fetch')
  },
  unmounted() {
    this.$store.dispatch('user/subscriptions/clear')
  }
}
</script>

<style>

</style>