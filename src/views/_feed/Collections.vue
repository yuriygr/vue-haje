<template>
  <template v-if="(!loading && !error) || data.length > 0">
    <div v-for="item in data" :key="`feed-${item.feed_id}`">
      <div>{{ item }}</div>
    </div>

    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </template>

  <template v-if="data.length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else
      :icon="$t('errors.empty_feeds.icon')"
      :header="$t('errors.empty_feeds.title')"
      :text="$t('errors.empty_feeds.description')"
    />
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { NButton, NHeader, Group, Placeholder, LoadmoreTrigger } from '@vue-norma/ui'

export default {
  name: 'feed-collections',
  components: {
    NButton, NHeader, Group, Placeholder, LoadmoreTrigger
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('feed.collections.title')
      }
    }
  },
  computed: {
    ...mapState('feed/collections', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('feed/collections', [ 'hasMoreItems' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('feed/collections/more')
    },
  },
  async mounted() {
    this.$store.dispatch('feed/collections/fetch')
  },
  unmounted() {
    this.$store.dispatch('feed/collections/clear')
  },
}
</script>
