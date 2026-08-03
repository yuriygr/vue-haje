<template>
  <template v-if="isAuth">
    <entry-pseudo-form @click="openComposeModal" @dropFile="openComposeModal($event)" />
    <spacer height="30" />
  </template>

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
import { defineAsyncComponent } from 'vue'
import { Placeholder, Spacer } from '@vue-norma/ui'

import { EntryItem, EntryPseudoForm } from '@/components/entry'
import { useFeedTimelineStore } from '@/app/store/modules/feed'
import { useAuthStore } from '@/app/store/modules/auth'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useModals } from '@vue-norma/ui'

const ComposeModal = defineAsyncComponent(() => import("@/modals/Compose.vue"))

export default {
  name: 'feed-timeline',
  components: {
    Placeholder, Spacer, EntryItem, EntryPseudoForm,
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t(`feed.tabs.timeline`)
      }
    }
  },
  setup() {
    const store = useFeedTimelineStore()
    const authStore = useAuthStore()
    const humanizeError = useHumanizeError()
    const modals = useModals()
    return { store, authStore, humanizeError, modals }
  },
  computed: {
    data()         { return this.store.data },
    filters()      { return this.store.filters },
    loading()      { return this.store.loading },
    error()        { return this.store.error },
    hasMoreItems() { return this.store.hasMoreItems },

    isAuth() { return this.authStore.isAuth },
  },
  methods: {
    openComposeModal(event) {
      this.modals.show(ComposeModal, {
        draggedFiles: event.dataTransfer ? [...event.dataTransfer.files] : []
      })
    },
    loadMore() {
      this.store.more()
    }
  },
  mounted() {
    this.store.fetch()
  },
  beforeUnmount() {
    this.store.clear()
  }
}
</script>