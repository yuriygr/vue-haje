<template>
  <template v-if="(!loading && !error) && Object.keys(data).length > 0">
    <n-header>{{ data.title  }}</n-header>
    <meta-info :items="metaItems" />
    <div v-html="data.content" />
  </template>
  
  <template v-if="Object.keys(data).length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-if="(!loading && !error)" :text="$t('help.errors.empty_page')" />
    <placeholder v-else-if="error"
      :icon="$t($filters.humanizeError(error).icon)"
      :header="$t($filters.humanizeError(error).title)"
      :text="$t($filters.humanizeError(error).description)"
    />
  </template>
</template>

<script>
import { Placeholder, PlaceholderLoading, NHeader, MetaInfo } from '@vue-norma/ui'

import { useHelpPageStore } from '@/app/components/stores/modules/help'

export default {
  name: 'help-page',
  props: {
    slug: {
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
        title: this.$t('help.title')
      },
    }
  },
  setup() {
    const store = useHelpPageStore()
    return { store }
  },
  computed: {
    data()         { return this.store.data },
    loading()      { return this.store.loading },
    error()        { return this.store.error },
    isEmpty()      { return this.store.isEmpty },
    metaItems() {
      let _result = []
      _result.push({ label: this.$t('help.meta.edited', { date: this.$filters.timeAgo(this.data.meta.date_edited, this.$i18n.locale) }) })

      return _result
    },
  },
  mounted() {
    this.store.fetch(this.slug)
  },
  beforeUnmount() {
    this.store.clear()
  },
  watch: {
    slug(to) {
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