<template>
  <badges-list v-if="(!loading && !error) || data.length > 0">
    <badge-item-wrapper v-for="item in data" :key="`badge-item-${item.badge_id}`">
      <badge-item :data="item" />
    </badge-item-wrapper>
    
    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </badges-list>

  <template v-if="data.length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else :text="$t('user.errors.badges_empty')" />
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Placeholder, PlaceholderLoading } from '@vue-norma/ui'
import { BadgesList, BadgeItem, BadgeItemWrapper } from '@/components/badge'

export default {
  name: 'user-badges',
  components: {
    Placeholder, PlaceholderLoading,
    BadgesList, BadgeItem, BadgeItemWrapper
  },
  computed: {
    ...mapState('user/badges', [ 'data', 'loading', 'error' ]),
    ...mapGetters('user/badges', [ 'hasMoreItems' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  data() {
    return { }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('user/badges/more')
    }
  },
  mounted() {
    this.$store.dispatch('user/badges/fetch')
  },
  beforeUnmount() {
    this.$store.dispatch('user/badges/clear')
  }
}
</script>

<style>

</style>