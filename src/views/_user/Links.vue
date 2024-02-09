<template>
  <links-list v-if="(!loading && !error) || data.length > 0">
    <link-item-wrapper v-for="item in data" :key="`link-item-${item.code}`">
      <link-item :data="item" />
    </link-item-wrapper>

    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />
    
    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </links-list>

  <template v-if="data.length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else :text="$t('user.errors.links_empty')" />
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Placeholder, PlaceholderLoading, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { LinkItem, LinksList, LinkItemWrapper } from '@/components/external_links'

export default {
  name: 'user-links',
  components: {
    Placeholder, PlaceholderLoading, NButton, LoadmoreTrigger,
    LinkItem, LinksList, LinkItemWrapper
  },
  computed: {
    ...mapState('user/links', [ 'data', 'loading', 'error' ]),
    ...mapGetters('user/links', [ 'hasMoreItems' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  data() {
    return {
      params: { }
    }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('user/links/more')
    }
  },
  mounted() {
    this.$store.dispatch('user/links/fetch')
  },
  unmounted() {
    this.$store.dispatch('user/links/clear')
  }
}
</script>

<style>

</style>