<template>
  <items-list type="badges" v-if="data.length > 0 || loading" :has-data="data.length > 0" :loading="loading" :has-more="hasMoreItems" @more="loadMore">
    <badge-item v-for="item in data" :key="`badge-${item.badge_id}`" v-memo="[item.badge_id]" :data="item" />

    <template #skeleton>
      <badge-item v-for="index in 5" :key="`item-${index}`" />
    </template>
  </items-list>

  <placeholder v-else-if="error"
    :icon="humanizeError(error).icon"
    :header="humanizeError(error).title"
    :text="humanizeError(error).description"
  />
  <placeholder v-else :text="t('user.errors.badges_empty')" />
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { Placeholder } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'

import { BadgeItem } from '@/components/badge'
import { useUserBadgesStore } from '@/app/store/modules/user'
import { useHumanizeError } from '@/app/composables/useHumanizeError'

defineOptions({
  name: 'user-badges'
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
const store = useUserBadgesStore()
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