<template>
  <template v-if="isAuth">
    <entry-pseudo-form @click="openComposeModal" @dropFile="openComposeModal($event)" />
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
    <entries-list v-if="loading">
      <entry-item-wrapper v-for="index in skeletons" :key="`item-${index}`">
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

let ComposeModal = defineAsyncComponent(() => import("@/modals/Compose.vue"))

export default {
  name: 'feed-abyss',
  components: {
    EntriesList,EntryItem, EntryItemWrapper, EntryPseudoForm,
    Placeholder, Spacer, NButton, LoadmoreTrigger,
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t(`feed.tabs.abyss`)
      }
    }
  },
  computed: {
    ...mapState('app', [ 'skeletons' ]),
    ...mapState('feed/abyss', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('feed/abyss', [ 'hasMoreItems' ]),
    ...mapGetters('auth', [ 'isAuth' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: {
    openComposeModal(event) {
      if (!this.isAuth) {
        this.$router.push({ name: 'auth' })
        return
      }
      this.$modals.show(ComposeModal, {
        draggedFiles: event.dataTransfer ? [...event.dataTransfer.files] : []
      })
    },
    loadMore() {
      this.$store.dispatch('feed/abyss/more')
    }
  },
  async mounted() {
    this.$store.dispatch('feed/abyss/fetch')
  },
  beforeUnmount() {
    this.$store.dispatch('feed/abyss/clear')
  },
  watch: {

  }
}
</script>

<style lang="scss">

</style>