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

<script>
import { Placeholder, PlaceholderLoading, NHeader, MetaInfo } from '@vue-norma/ui'

import { useI18n } from 'vue-i18n'
import { useSupportTicketStore } from '@/app/store/modules/support'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'

export default {
  name: 'support-ticket',
  props: {
    uuid: {
      type: [ Boolean, String ],
      default: false
    }
  },
  components: {
    Placeholder, PlaceholderLoading, NHeader, MetaInfo
  },
  setup() {
    const { t } = useI18n()
    const store = useSupportTicketStore()
    const humanizeError = useHumanizeError()
    useMeta(() => ({ title: t('support.ticket') }))

    return { t, store, humanizeError }
  },
  computed: {
    data()         { return this.store.data },
    loading()      { return this.store.loading },
    error()        { return this.store.error },
    isEmpty()      { return this.store.isEmpty },
  },
  mounted() {
    this.store.fetch(this.uuid)
  },
  beforeUnmount() {
    this.store.clear()
  },
  watch: {
    uuid(to) {
      if (to) {
        this.store.clear()
        this.store.fetch(to)
      }
    },
    data(to) {
      if (to)
        this.meta.title = to.title
    },
    error(to) {
      if (to)
        this.meta.title = this.humanizeError(to).title
    }
  }
}
</script>