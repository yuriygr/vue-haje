<template>
  <div class="search-form">
    <div class="search-form__field">
      <text-field
        icon="search-line"
        size="m"
        :modelValue="query"
        :placeholder="t('search.search-field.placeholder')"

        @keyup.enter="changeInput($event.target.value)"
      />
    </div>
  </div>

  <spacer height="15" />

  <items-list type="helps" v-if="data.length > 0 || loading" :has-data="data.length > 0" :loading="loading" :has-more="hasMoreItems" @more="loadMore">
    <help-item v-for="item in data" :key="`help-${item.page_id}`" v-memo="[item.page_id]" :data="item" />

    <template #skeleton>
      <help-item v-for="index in 7" :key="`item-${index}`" />
    </template>
  </items-list>

  <placeholder v-else-if="error"
    :icon="humanizeError(error).icon"
    :header="humanizeError(error).title"
    :text="humanizeError(error).description"
  />
  <placeholder v-else
    :icon="t('help.empty.icon')"
    :header="t('help.empty.title')"
    :text="t('help.empty.description')"
  />
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { Placeholder, Spacer } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { HelpItem } from '@/components/help'
import { useHelpPagesStore } from '@/app/store/modules/help'
import { useMeta } from '@/app/composables/useMeta'
import { useHumanizeError } from '@/app/composables/useHumanizeError'

defineOptions({
  name: 'help-pages'
})

// Composables
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const store = useHelpPagesStore()
const humanizeError = useHumanizeError()
const { data, loading, error, hasMoreItems } = storeToRefs(store)
useMeta(() => ({ title: t('help.title') }))

// Computed
const query = computed(() => route.query.q ?? '')

// Methods
function changeInput(value) {
  router.replace({ name: route.name, query: { ...route.query, q: value } })
}

function loadMore() {
  store.more()
}

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