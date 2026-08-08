<template>
  <group>
    <n-header>{{ t('support.title') }}</n-header>
    <form-group>
      <form-block :label="t('support.field.subject')">
        <text-field tabindex="1" type="text" name="subject" />
      </form-block>

      <form-block :label="t('support.field.category')">
        <select-field tabindex="2" name="category">
          <option>category</option>
          <option>category</option>
          <option>category</option>
          <option>category</option>
        </select-field>
      </form-block>

      <form-block :label="t('support.field.message')">
        <textarea></textarea>
      </form-block>

      <form-block>
        <n-button tabindex="3" size="l">{{ t('action.create') }}</n-button>
      </form-block>
    </form-group>
  </group>

  <group>
    <n-header>{{ $('support.tickets') }}</n-header>

    <items-list type="tickets" v-if="data.length > 0 || loading" :has-data="data.length > 0" :loading="loading" :has-more="hasMoreItems" @more="loadMore">
      <ticket-item v-for="item in data" :key="`ticket-${item.uuid}`" v-memo="[item.uuid]" :data="item" />

      <template #skeleton>
        <ticket-item v-for="index in 15" :key="`item-${index}`" />
      </template>
    </items-list>

    <placeholder v-else-if="error"
      :icon="humanizeError(error).icon"
      :header="humanizeError(error).title"
      :text="humanizeError(error).description"
    />
    <placeholder v-else
      :icon="t('support.empty.icon')"
      :header="t('support.empty.title')"
      :text="t('support.empty.description')"
    />
  </group>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { onMounted, onBeforeUnmount } from 'vue'
import { Placeholder, NButton, NHeader, Group } from '@vue-norma/ui'
import { storeToRefs } from 'pinia'

import { TicketItem } from '@/components/ticket'
import { useSupportTicketsStore } from '@/app/store/modules/support'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'

// Composables
const { t } = useI18n()
const store = useSupportTicketsStore()
const humanizeError = useHumanizeError()
const { data, filters, loading, error, hasMoreItems } = storeToRefs(store)
useMeta(() => ({ title: t('support.title') }))

// Methods
function loadMore() {
  store.more()
}

// Lifecycle hooks
onMounted(() => store.fetch())
onBeforeUnmount(() => store.clear())
</script>
