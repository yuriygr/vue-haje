<template>
  <entries-list v-if="data.length > 0 || loading">
    <template v-if="data.length > 0">
      <entry-item-wrapper v-for="item in data" :key="`entry-${item.uuid}`" v-memo="[item.uuid]">
        <entry-item :data="item" type="short" :showPinAction="false" />
      </entry-item-wrapper>

      <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />
      <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
    </template>
  
    <template v-else-if="loading">
      <entry-item-wrapper v-for="index in 15" :key="`item-${index}`">
        <entry-item type="short" />
      </entry-item-wrapper>
    </template>
  </entries-list>

  <placeholder v-else-if="error"
    :icon="$t($filters.humanizeError(error).icon)"
    :header="$t($filters.humanizeError(error).title)"
    :text="$t($filters.humanizeError(error).description)"
  />
  <placeholder v-else
    :icon="$t('errors.empty_feed.icon')"
    :header="$t('errors.empty_feed.title')"
    :text="$t('errors.empty_feed.description')"
  />
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Placeholder, Spacer, NButton, LoadmoreTrigger } from '@vue-norma/ui'

import { EntriesList, EntryItem, EntryItemWrapper, EntryPseudoForm } from '@/components/entry'

export default {
  name: 'feed-custom-entries',
  props: {
    uuid: {
      type: [ Boolean, String ],
      default: false
    }
  },
  components: {
    EntriesList,EntryItem, EntryItemWrapper, EntryPseudoForm,
    Placeholder, Spacer, NButton, LoadmoreTrigger
  },
  data() {
    return { }
  },
  computed: {
    ...mapState('feed/custom/entries', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('feed/custom/entries', [ 'hasMoreItems' ])
  },
  methods: {
    loadMore() {
      this.$store.dispatch('feed/custom/entries/more')
    }
  },
  mounted() {
    this.$store.dispatch('feed/custom/entries/fetch')
  },
  beforeUnmount() {
    this.$store.dispatch('feed/custom/entries/clear')
  },
  watch: {
    '$route.params.uuid'(to) {
      if (to) {
        this.$store.dispatch('feed/custom/entries/fetch')
      }
    }
  }
}
</script>

<style lang="scss">

</style>