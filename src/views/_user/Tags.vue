<template>
  <tags-list v-if="(!loading && !error) || data.length > 0">
    <tag-item-wrapper v-for="item in data" :key="`tag-item-${item.tag_id}`">
      <tag-item :data="item" />
    </tag-item-wrapper>

    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />
    
    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </tags-list>

  <template v-if="data.length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else :text="$t('user.errors.tags_empty')" />
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Placeholder, PlaceholderLoading, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { TagsList, TagItem, TagItemWrapper } from '@/components/tag'

export default {
  name: 'user-tags',
  components: {
    Placeholder, PlaceholderLoading, NButton, LoadmoreTrigger,
    TagsList, TagItem, TagItemWrapper
  },
  computed: {
    ...mapState('user/tags', [ 'data', 'loading', 'error' ]),
    ...mapGetters('user/tags', [ 'hasMoreItems' ]),
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
      this.$store.dispatch('user/tags/more')
    }
  },
  mounted() {
    this.$store.dispatch('user/tags/fetch')
  },
  unmounted() {
    this.$store.dispatch('user/tags/clear')
  }
}
</script>

<style>

</style>