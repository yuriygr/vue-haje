<template>
  <div class="search-form">
    <div class="search-form__field">
      <text-field
        icon="search-line"
        size="m"
        :modelValue="query"
        :placeholder="$t('search.search-field.placeholder')"

        @keyup.enter="changeInput($event.target.value)"
      />
    </div>
    <div class="search-form__filter">
      <n-button icon_before="add-line" mode="tertiary" size="l" @click="openCreateModal" :title="$t('action.create')" />
    </div>
  </div>

  <spacer height="15" />

  <items-list type="feeds" v-if="data.length > 0 || loading" :has-data="data.length > 0" :loading="loading" :has-more="hasMoreItems" @more="loadMore">
    <feed-item v-for="item in data" :key="`feed-${item.feed_id}`" v-memo="[item.feed_id]" :data="item" />

    <template #skeleton>
      <feed-item v-for="index in 15" :key="`item-${index}`" />
    </template>
  </items-list>

  <placeholder v-else-if="error"
    :icon="humanizeError(error).icon"
    :header="humanizeError(error).title"
    :text="humanizeError(error).description"
  />
  <placeholder v-else
    :icon="$t('feeds.empty.icon')"
    :header="$t('feeds.empty.title')"
    :text="$t('feeds.empty.description')"
  />
</template>

<script setup>
// Imports
import { computed, watch, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { NButton, Spacer, Placeholder, useModals } from '@vue-norma/ui'
import { storeToRefs } from 'pinia'

import { useFeedsStore } from '@/app/store/modules/feeds'
import { FeedItem } from '@/components/feed'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'

const FeedCreateModal = defineAsyncComponent(() => import("@/modals/_feed/Create.vue"))

// Composables
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useFeedsStore()
const humanizeError = useHumanizeError()
const modals = useModals()
const { data, filters, loading, error, hasMoreItems } = storeToRefs(store)

useMeta(() => ({ title: t('feeds.title') }))

// Computed
const query = computed(() => route.query.q ?? '')

// Methods
const openCreateModal = () => modals.show(FeedCreateModal)
const loadMore = () => store.more()
const changeInput = (value) => router.replace({ name: route.name, query: { ...route.query, q: value } })

// Watchers
watch(() => route.query.q, (to) => {
  store.setFilters({ query: to, offset: undefined })
  store.fetch()
})

// Lifecycle hooks
onMounted(() => {
  store.setFilters({ query: query.value, offset: undefined })
  store.fetch()
})
onBeforeUnmount(() => store.clear())
</script>

<style lang="scss">
.search-form {
  display: flex;
  justify-content: space-between;

  &__field {
    display: flex;
    width: 100%;
  }

  &__filter {
    display: flex;
    margin-left: 5px;
  }
}
</style>