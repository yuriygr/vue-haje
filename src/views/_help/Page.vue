<template>
  <template v-if="(!loading && !error) && !isEmpty">
    <n-header>{{ data.title }}</n-header>
    <meta-info :items="metaItems" />
    <div v-html="data.content" />
  </template>

  <template v-if="isEmpty">
    <placeholder-loading v-if="loading" />
    <placeholder v-if="(!loading && !error)" :text="t('help.errors.empty_page')" />
    <placeholder v-else-if="error"
      :icon="humanizeError(error).icon"
      :header="humanizeError(error).title"
      :text="humanizeError(error).description"
    />
  </template>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { Placeholder, PlaceholderLoading, NHeader, MetaInfo } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

import { useHelpPageStore } from '@/app/store/modules/help'
import { useTimeAgo } from '@/app/composables/useTimeAgo.js'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'

defineOptions({
  name: 'help-page'
})

// Props
const props = defineProps({
  slug: {
    type: [Boolean, String],
    default: false
  }
})

// Composables
const { t } = useI18n()
const store = useHelpPageStore()
const { timeAgo } = useTimeAgo()
const humanizeError = useHumanizeError()
const { data, loading, error, isEmpty } = storeToRefs(store)
const { setTitle } = useMeta(() => ({ title: t('help.title') }))

// Computed
const formattedDate = computed(() => timeAgo(data.value.meta.date_edited))

const metaItems = computed(() => {
  const result = []
  result.push({ label: t('help.meta.edited', { date: formattedDate.value }) })
  return result
})

// Watchers
watch(() => props.slug, (to) => {
  if (to) {
    store.clear()
    store.fetch(to)
  }
})

watch(data, (to) => {
  if (to) setTitle(to.title)
})

watch(error, (to) => {
  if (to) setTitle(humanizeError(to).title)
})

// Lifecycle hooks
onMounted(() => store.fetch(props.slug))
onBeforeUnmount(() => store.clear())
</script>