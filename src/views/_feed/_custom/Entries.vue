<template>
  <items-list type="entries" v-if="data.length > 0 || loading" :has-data="data.length > 0" :loading="loading" :has-more="hasMoreItems" @more="loadMore">
    <entry-item v-for="item in data" :key="`entry-${item.uuid}`" v-memo="[item.uuid]" :data="item" />

    <template #skeleton>
      <entry-item v-for="index in 15" :key="`item-${index}`" />
    </template>
  </items-list>

  <placeholder v-else-if="error"
    :icon="humanizeError(error).icon"
    :header="humanizeError(error).title"
    :text="humanizeError(error).description"
  />
  <placeholder v-else
    :icon="$t('errors.empty_feed.icon')"
    :header="$t('errors.empty_feed.title')"
    :text="$t('errors.empty_feed.description')"
  />
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Placeholder } from '@vue-norma/ui'

import { EntryItem } from '@/components/entry'
import { useHumanizeError } from '@/app/composables/useHumanizeError'

export default {
  name: 'feed-custom-entries',
  props: {
    uuid: {
      type: [ Boolean, String ],
      default: false
    }
  },
  components: {
    Placeholder, EntryItem
  },
  setup() {
    const humanizeError = useHumanizeError()
    return { humanizeError }
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