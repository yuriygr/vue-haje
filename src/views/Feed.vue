<template>
  <tabs>
    <template v-for="(item, index) in tabs" :key="`feed-tab-${item.key}-${index}`">
      <tabs-item :to="item.to" size="s" :selected="item.key == $route.meta.tab">{{ item.label }}</tabs-item>
    </template>
  </tabs>

  <spacer height="30" />

  <template v-if="isAuth">
    <entry-pseudo-form @click="openComposeModal" />
    <spacer height="30" />
  </template>

  <entries-list v-if="(!loading && !error) || data.length > 0">
    <entry-item-wrapper v-for="item in data" :key="`entry-${item.uuid}`">
      <entry-item :data="item" type="short" />
    </entry-item-wrapper>

    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </entries-list>

  <template v-if="data.length == 0">
    <placeholder-loading v-if="loading" />
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
import { Placeholder, PlaceholderLoading, Spacer, Tabs, TabsItem, Separator, NButton, LoadmoreTrigger, IconButton } from '@vue-norma/ui'

import { EntriesList, EntryItem, EntryItemWrapper, EntryPseudoForm } from '@/components/entry'

let ComposeModal = defineAsyncComponent(() => import("@/components/modals/Compose.vue"))

export default {
  name: 'feed',
  components: {
    EntriesList,EntryItem, EntryItemWrapper, EntryPseudoForm,
    Placeholder, PlaceholderLoading, Separator, NButton, LoadmoreTrigger, Spacer, Tabs, TabsItem, IconButton
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('feed.title')
      }
    }
  },
  computed: {
    ...mapState('auth', {
      'session_data': state => state.data
    }),
    ...mapState('feed', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('feed', [ 'hasMoreItems' ]),
    ...mapGetters('auth', [ 'isAuth' ]),
    tabs() {
      return [
        { key: 'timeline', to: { name: 'feed-timeline' }, label: this.$t('feed.tabs.timeline') },
        { key: 'popular', to: { name: 'feed-popular' }, label: this.$t('feed.tabs.popular') },
        { key: 'abyss', to: { name: 'feed-abyss' }, label: this.$t('feed.tabs.abyss') }
      ]
    },
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
    },
    loadMore() {
      this.$store.dispatch('feed/more')
    }
  },
  async mounted() {
    await this.$store.dispatch('feed/clear')
    await this.$store.dispatch('feed/setTab', this.$route.meta.tab)
    this.$store.dispatch('feed/fetch')
  },
  unmounted() {
    this.$store.dispatch('feed/clear')
  },
  watch: {
    async '$route'(to) {
      await this.$store.dispatch('feed/clear')
      await this.$store.dispatch('feed/setTab', to.meta.tab)
      this.$store.dispatch('feed/fetch')
    }
  }
}
</script>

<style lang="scss">

</style>