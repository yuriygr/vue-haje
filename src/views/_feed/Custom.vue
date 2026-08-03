<template>
  <template v-if="(!loading && !error) && Object.keys(data).length > 0">
    <feed-item :data="data" />

    <separator />

    <router-view :key="$route.fullPath" :uuid="uuid" />
  </template>

  <template v-if="Object.keys(data).length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="humanizeError(error).icon"
      :header="humanizeError(error).title"
      :text="humanizeError(error).description"
    />
  </template>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { Placeholder, PlaceholderLoading, Separator } from '@vue-norma/ui'
import { storeToRefs } from 'pinia'

import { FeedItem } from '@/components/feed'
import { useCustomFeed } from '@/app/store/modules/custom_feed'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'

const props = defineProps({
  uuid: {
    type: [Boolean, String],
    default: false
  }
})

const { t } = useI18n()
const store = useCustomFeed()
const humanizeError = useHumanizeError()
const { data, loading, error, isEmpty } = storeToRefs(store)

const title = ref(t('feed.title'))

useMeta(() => ({ title: title.value }))

watch(() => props.uuid, (to) => {
  if (to) {
    store.clear()
    store.fetch(to)
  }
})

watch(data, (to) => {
  if (to) title.value = to.title
})

watch(error, (to) => {
  if (to) title.value = humanizeError(to).title
})

onMounted(() => {
  store.fetch(props.uuid)
})
onBeforeUnmount(() => store.clear())
</script>