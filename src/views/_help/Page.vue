<template>
  <template v-if="(!loading && !error) && Object.keys(data).length > 0">
    <n-header>{{ data.title  }}</n-header>
    <meta-info :items="metaItems" />
    <div v-html="data.content" />
  </template>
  
  <template v-if="Object.keys(data).length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-if="(!loading && !error)" :text="t('help.errors.empty_page')" />
    <placeholder v-else-if="error"
      :icon="humanizeError(error).icon"
      :header="humanizeError(error).title"
      :text="humanizeError(error).description"
    />
  </template>
</template>

<script>
import { ref } from 'vue'
import { Placeholder, PlaceholderLoading, NHeader, MetaInfo } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'

import { useHelpPageStore } from '@/app/store/modules/help'
import { useTimeAgo } from '@/app/composables/useTimeAgo.js'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'

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
  setup() {
    const { t } = useI18n()
    const store = useHelpPageStore()
    const { timeAgo } = useTimeAgo()
    const humanizeError = useHumanizeError()

    const title = ref(t('help.title'))

    useMeta(() => ({ title: title.value }))

    return { t, title, store, timeAgo, humanizeError }
  },
  computed: {
    data()         { return this.store.data },
    loading()      { return this.store.loading },
    error()        { return this.store.error },
    isEmpty()      { return this.store.isEmpty },
    metaItems() {
      let _result = []
      _result.push({ label: this.t('help.meta.edited', { date: this.formattedDate }) })

      return _result
    },
    formattedDate() {
      return this.timeAgo(this.data.meta.date_edited)
    }
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
        this.title = to.title
    },
    error(to) {
      if (to)
        this.title = this.humanizeError(to).title
    }
  }
}
</script>