<template>
  <template v-if="(!loading && !error) && Object.keys(data).length > 0">
    {{ data }}
  </template>
  
  <template v-if="Object.keys(data).length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="humanizeError(error).icon"
      :header="humanizeError(error).title"
      :text="humanizeError(error).description"
    />
    <placeholder v-else
      :icon="t('support.empty_ticket.icon')"
      :header="t('support.empty_ticket.title')"
      :text="t('support.empty_ticket.description')"
    />
  </template>
</template>

<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount } from 'vue'
import { Placeholder, PlaceholderLoading, NHeader, MetaInfo } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

import { useSupportTicketStore } from '@/app/store/modules/support'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'

defineOptions({ name: 'support-ticket' })

const props = defineProps({
  uuid: {
    type: String,
    default: null
  }
})

// Composables
const { t } = useI18n()
const store = useSupportTicketStore()
const humanizeError = useHumanizeError()
const { data, loading, error, isEmpty } = storeToRefs(store)
const { setTitle } = useMeta(() => ({ title: t('support.ticket') }))

// Watchers
watch(() => props.uuid, (to) => {
  if (to) {
    store.clear()
    store.fetch(to)
  }
})

watch(() => store.data, (to) => {
  if (to) setTitle(to.subject)
})

watch(() => store.error, (to) => {
  if (to) setTitle(humanizeError(to).title)
})

// Lifecycle hooks
onMounted(() => store.fetch(props.uuid))
onBeforeUnmount(() => store.clear())
</script>