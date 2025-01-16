<template>
  <entries-list v-if="(!loading && !error) || data.length > 0">
    <entry-item-wrapper v-for="item in data" :key="`entry-${item.uuid}`">
      <entry-item :data="item" type="short" />
    </entry-item-wrapper>

    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </entries-list>

  <template v-if="data.length == 0">
    <entries-list v-if="loading">
      <entry-item-wrapper v-for="item in skeletons">
        <entry-item type="short" />
      </entry-item-wrapper>
    </entries-list>
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else
      :icon="$t('errors.empty_feed.icon')"
      :header="$t('errors.empty_feed.title')"
      :text="$t('errors.empty_feed.description')"
    />
  </template>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapState, mapGetters } from 'vuex'
import { Placeholder, Spacer, NButton, LoadmoreTrigger } from '@vue-norma/ui'

import { EntriesList, EntryItem, EntryItemWrapper, EntryPseudoForm } from '@/components/entry'

let ComposeModal = defineAsyncComponent(() => import("@/components/modals/Compose.vue"))

export default {
  name: 'feed-feed',
  props: {
    uuid: {
      type: [ Boolean, String ],
      defalult: false
    }
  },
  components: {
    EntriesList,EntryItem, EntryItemWrapper, EntryPseudoForm,
    Placeholder, Spacer, NButton, LoadmoreTrigger
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('feed.tabs.feeds')
      }
    }
  },
  computed: {
    ...mapState('app', [ 'skeletons' ]),
    ...mapState('feed', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('feed', [ 'hasMoreItems' ]),
    ...mapGetters('auth', [ 'isAuth' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: {
    openComposeModal() {
      if (!this.isAuth) {
        this.$router.push({ name: 'auth' })
        return
      }
      this.$modals.show(ComposeModal)
    }
  },
  async mounted() {
    await this.$store.dispatch('feed/feed/fetch', this.uuid)
  },
  unmounted() {
    this.$store.dispatch('feed/clear')
  },
  watch: {
    async '$route'(to) {
      await this.$store.dispatch('feed/feed/fetch', to.params.uuid)
    }
  }
}
</script>

<style lang="scss">

</style>