<template>
  <items-list type="entries" v-if="data.length > 0 || loading" :has-data="data.length > 0" :loading="loading" :has-more="hasMoreItems" @more="loadMore">
    <entry-item v-for="item in data" :key="`entry-${item.uuid}`" v-memo="[item.uuid]" :data="item" :showPinAction="true" />

    <template #skeleton>
      <entry-item v-for="index in 15" :key="`item-${index}`" />
    </template>
  </items-list>

  <placeholder v-else-if="error"
    :icon="humanizeError(error).icon"
    :header="humanizeError(error).title"
    :text="humanizeError(error).description"
  />
  <placeholder v-else :text="t('user.errors.entries_empty')" />
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { Placeholder } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'

import { EntryItem } from '@/components/entry'
import { useUserEntriesStore } from '@/app/store/modules/user'
import { useHumanizeError } from '@/app/composables/useHumanizeError'

defineOptions({
  name: 'user-entries'
})

// Props
const props = defineProps({
  username: {
    type: [Boolean, String],
    default: false
  }
})

// Composables
const { t } = useI18n()
const store = useUserEntriesStore()
const humanizeError = useHumanizeError()

// Computed
const data = computed(() => store.data)
const filters = computed(() => store.filters)
const loading = computed(() => store.loading)
const error = computed(() => store.error)
const hasMoreItems = computed(() => store.hasMoreItems)

// Methods
function loadMore() {
  store.more(props.username)
}

// Lifecycle hooks
onMounted(() => store.fetch(props.username))
onBeforeUnmount(() => store.clear())
</script>