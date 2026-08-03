<template>
  <div class="search-form">
    <div class="search-form__field">
      <text-field
        icon="search-line"
        size="m"
        :modelValue="query"
        :placeholder="$t('search.search-field.placeholder')"

        @keyup.enter="changeInput($event.target.value)"
      />
    </div>
  </div>

  <spacer height="15" />

  <items-list type="helps" v-if="data.length > 0 || loading" :has-data="data.length > 0" :loading="loading" :has-more="hasMoreItems" @more="loadMore">
    <help-item v-for="item in data" :key="`help-${item.page_id}`" v-memo="[item.page_id]" :data="item" />

    <template #skeleton>
      <help-item v-for="index in 7" :key="`item-${index}`" />
    </template>
  </items-list>

  <placeholder v-else-if="error"
    :icon="humanizeError(error).icon"
    :header="humanizeError(error).title"
    :text="humanizeError(error).description"
  />
  <placeholder v-else
    :icon="$t('help.empty.icon')"
    :header="$t('help.empty.title')"
    :text="$t('help.empty.description')"
  />
</template>

<script>
import { Placeholder, Spacer } from '@vue-norma/ui'

import { HelpItem } from '@/components/help'
import { useHelpPagesStore } from '@/app/store/modules/help'
import { useHumanizeError } from '@/app/composables/useHumanizeError'

export default {
  name: 'help-pages',
  components: {
    Placeholder, Spacer, HelpItem
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('help.title')
      }
    }
  },
  setup() {
    const store = useHelpPagesStore()
    const humanizeError = useHumanizeError()
    return { store, humanizeError }
  },
  computed: {
    data()         { return this.store.data },
    filters()      { return this.store.filters },
    loading()      { return this.store.loading },
    error()        { return this.store.error },
    hasMoreItems() { return this.store.hasMoreItems },
    query()        { return this.$route.query.q ?? '' },
  },
  methods: {
    changeInput(value) {
      this.$router.replace({ name: this.$route.name, query: { ...this.$route.query, q: value } })
    },
    loadMore() {
      this.store.more(this.slug)
    }
  },
  mounted() {
    this.store.setFilters({ query: this.query, offset: undefined })
    this.store.fetch(this.slug)
  },
  beforeUnmount() {
    this.store.clear()
  },
  watch: {
    '$route.query.q'(to) {
      this.store.setFilters({ query: to, offset: undefined })
      this.store.fetch()
    }
  }
}
</script>