<template>
  <template v-if="isAuth">
    <entry-pseudo-form @click="openComposeModal" @dropFile="openComposeModal($event)" />
    <spacer height="30" />
  </template>

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
    ...mapState('feed/abyss', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('feed/abyss', [ 'hasMoreItems' ]),
    ...mapGetters('auth', [ 'isAuth' ])
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
  mounted() {
    this.$store.dispatch('feed/abyss/fetch')
  },
  beforeUnmount() {
    this.$store.dispatch('feed/abyss/clear')
  }
}
</script>