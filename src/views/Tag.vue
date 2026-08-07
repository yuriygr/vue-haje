<template>
  <template v-if="(!loading && !error) && !isEmpty">
    <tag-card :data="data" />

    <separator />

    <router-view v-slot="{ Component }" name="tag">
      <keep-alive>
        <component :is="Component" :slug="slug" />
      </keep-alive>
    </router-view>
  </template>

  <template v-if="isEmpty">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="humanizeError(error).icon"
      :header="humanizeError(error).title"
      :text="humanizeError(error).description"
    />
  </template>
</template>

<script setup>
// Imports
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { Placeholder, PlaceholderLoading, Separator } from '@vue-norma/ui'
import { storeToRefs } from 'pinia'

import { TagCard } from '@/components/tag'
import { useTagStore } from '@/app/store/modules/tag'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'

defineOptions({ name: 'tag' })

// Props
const props = defineProps({
  slug: {
    type: [Boolean, String],
    default: false
  }
})

// Composables
const { t } = useI18n()
const store = useTagStore()
const humanizeError = useHumanizeError()
const { data, loading, error, isEmpty } = storeToRefs(store)
const { setTitle } = useMeta(() => ({ title: t('tag.title') }))

// Watchers
watch(() => props.slug, (to) => {
  if (to) {
    store.clear()
    store.fetch(to)
  }
})

watch(data, (to) => {
  if (to) setTitle(`#${to.slug}`)
})

watch(error, (to) => {
  if (to) setTitle(humanizeError(to).title)
})

// Lifecycle hooks
onMounted(() => {
  setTitle(`#${props.slug}`)
  store.fetch(props.slug)
})
onBeforeUnmount(() => store.clear())
</script>