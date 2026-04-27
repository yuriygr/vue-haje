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

  <helps-list v-if="data.length > 0 || loading">
    <template v-if="data.length > 0">
      <help-item-wrapper v-for="item in data" :key="`help-${item.page_id}`" v-memo="[item.page_id]">
        <help-item :data="item" />
      </help-item-wrapper>

      <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />
      <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
    </template>

    <template v-else-if="loading">
      <help-item-wrapper v-for="index in 7" :key="`item-${index}`">
        <help-item />
      </help-item-wrapper>
    </template>
  </helps-list>

  <placeholder v-else-if="error"
    :icon="$t($filters.humanizeError(error).icon)"
    :header="$t($filters.humanizeError(error).title)"
    :text="$t($filters.humanizeError(error).description)"
  />
  <placeholder v-else
    :icon="$t('help.empty.icon')"
    :header="$t('help.empty.title')"
    :text="$t('help.empty.description')"
  />
</template>

<script>
import { Placeholder, Spacer } from '@vue-norma/ui'

import { HelpsList, HelpItem, HelpItemWrapper } from '@/components/help'
import { useHelpPagesStore } from '@/app/components/stores/modules/help'

export default {
  name: 'help-pages',
  components: {
    HelpsList, HelpItem, HelpItemWrapper,
    Placeholder, Spacer
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
    return { store }
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