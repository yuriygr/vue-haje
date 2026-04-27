<template>
  <group>
    <n-header>{{ $t('support.title') }}</n-header>
    <form-group>
      <form-block :label="$t('support.field.subject')">
        <text-field tabindex="1" type="text" name="subject" />
      </form-block>

      <form-block :label="$t('support.field.category')">
        <select-field tabindex="2" name="category">
          <option>category</option>
          <option>category</option>
          <option>category</option>
          <option>category</option>
        </select-field>
      </form-block>

      <form-block :label="$t('support.field.message')">
        <textarea></textarea>
      </form-block>

      <form-block>
        <n-button tabindex="3" size="l">{{ $t('action.create') }}</n-button>
      </form-block>
    </form-group>
  </group>

  <group>
    <n-header>{{ $t('support.tickets') }}</n-header>
    <tickets-list v-if="data.length > 0 || loading">
      <template v-if="data.length > 0">
        <ticket-item-wrapper v-for="item in data" :key="`ticket-${item.uuid}`" v-memo="[item.uuid]">
          <ticket-item :data="item" />
        </ticket-item-wrapper>

        <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />
        <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
      </template>

      <template v-else-if="loading">
        <ticket-item-wrapper v-for="index in 15" :key="`item-${index}`">
          <ticket-item />
        </ticket-item-wrapper>
      </template>
    </tickets-list>

    <placeholder v-else-if="error"
      :icon="$t($filters.humanizeError(error).icon)"
      :header="$t($filters.humanizeError(error).title)"
      :text="$t($filters.humanizeError(error).description)"
    />
    <placeholder v-else
      :icon="$t('support.empty.icon')"
      :header="$t('support.empty.title')"
      :text="$t('support.empty.description')"
    />
  </group>
</template>

<script>
import { Placeholder, PlaceholderLoading, NButton, LoadmoreTrigger, NHeader, Group } from '@vue-norma/ui'

import { TicketsList, TicketItem, TicketItemWrapper } from '@/components/ticket'
import { useSupportTicketsStore } from '@/app/components/stores/modules/support'

export default {
  name: 'support-tickets',
  components: {
    TicketsList, TicketItem, TicketItemWrapper,
    Placeholder, PlaceholderLoading, NButton, NHeader, LoadmoreTrigger, Group
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('support.title')
      }
    }
  },
  setup() {
    const store = useSupportTicketsStore()
    return { store }
  },
  computed: {
    data()         { return this.store.data },
    filters()      { return this.store.filters },
    loading()      { return this.store.loading },
    error()        { return this.store.error },
    hasMoreItems() { return this.store.hasMoreItems },
  },
  methods: {
    loadMore() {
      this.store.more(this.slug)
    }
  },
  mounted() {
    this.store.fetch(this.slug)
  },
  beforeUnmount() {
    this.store.clear()
  }
}
</script>
