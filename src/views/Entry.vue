<template>
  <template v-if="!isEmpty">
    <entry-item :data="data" type="full" />
    
    <entry-comments v-if="data.state.is_comments_enabled" :entry="data" />
    <placeholder v-else :text="$t('entry.errors.comments_disabled')" />
  </template>
  
  <template v-if="isEmpty">
    <entry-item v-if="loading" type="full" />
    
    <placeholder v-else-if="error"
      :icon="humanizeError(error).icon"
      :header="humanizeError(error).title"
      :text="humanizeError(error).description"
    />
    <placeholder v-else :text="$t('entry.errors.empty')" />
  </template>

</template>

<script setup>
import { watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { Placeholder } from '@vue-norma/ui'
import { storeToRefs } from 'pinia'

import { truncateText } from '@/app/services/content'
import EntryComments from '@/views/EntryComments'
import { EntryItem } from '@/components/entry'
import { useEntryStore } from '@/app/store/modules/entry'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'

defineOptions({ name: 'entry' })

// Props
const props = defineProps({
  uuid: {
    type: String,
    default: '',
    validator: (v) => v !== ''
  }
})

// Composables
const { t } = useI18n()
const store = useEntryStore()
const humanizeError = useHumanizeError()
const { data, loading, error, isEmpty } = storeToRefs(store)
const { setTitle } = useMeta(() => ({ title: t('entry.title') }))

// Watchers
watch(() => props.uuid, (to) => {
  if (to != undefined) {
    store.clear()
    store.fetch(to)
  }
})

watch(data, (to) => {
  if (to.content)
  setTitle(to.content.text != '' ? truncateText(to.content.text) : t('entry.title'))
}, { immediate: true })

watch(error, (to) => {
  if (to) setTitle(humanizeError(to).title)
})

// Lifecycle hooks
onMounted(() => store.fetch(props.uuid))
onBeforeUnmount(() => store.clear())
</script>