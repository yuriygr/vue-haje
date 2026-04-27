<template>
  <template v-if="(!loading && !error) && Object.keys(data).length > 0">
    {{ data }}
  </template>
  
  <template v-if="Object.keys(data).length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t($filters.humanizeError(error).icon)"
      :header="$t($filters.humanizeError(error).title)"
      :text="$t($filters.humanizeError(error).description)"
    />
    <placeholder v-else
      :icon="$t('support.empty_ticket.icon')"
      :header="$t('support.empty_ticket.title')"
      :text="$t('support.empty_ticket.description')"
    />
  </template>
</template>

<script>
import { Placeholder, PlaceholderLoading, NHeader, MetaInfo } from '@vue-norma/ui'

import { useSupportTicketStore } from '@/app/components/stores/modules/support'

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
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('support.ticket')
      },
    }
  },
  setup() {
    const store = useSupportTicketStore()
    return { store }
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
        this.meta.title = this.$t(this.$filters.humanizeError(this.error).title)
    }
  }
}
</script>