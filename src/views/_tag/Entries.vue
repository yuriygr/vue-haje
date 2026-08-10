<template>
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
  <placeholder v-else :text="t('tag.errors.entries_empty')" />
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { Placeholder } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

import { EntryItem } from '@/components/entry'
import { useTagEntriesStore } from '@/app/store/modules/tag'
import { useHumanizeError } from '@/app/composables/useHumanizeError'

defineOptions({ name: 'tag-entries' })

// Props
const props = defineProps({
  slug: {
    type: [Boolean, String],
    default: false
  }
})

// Composables
const { t } = useI18n()
const store = useTagEntriesStore()
const humanizeError = useHumanizeError()
const { data, loading, error, hasMoreItems } = storeToRefs(store)

// Methods
function loadMore() {
  store.more(props.slug)
}

// Lifecycle hooks
onMounted(() => store.fetch(props.slug))
onBeforeUnmount(() => store.clear())
</script>