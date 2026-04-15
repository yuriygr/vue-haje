<template>
  <template v-if="(!loading && !error) && Object.keys(data).length > 0">
    <tag-card :data="data" />

    <separator />

    <router-view v-slot="{ Component }" name="tag">
      <keep-alive>
        <component :is="Component" :slug="slug" />
      </keep-alive>
    </router-view>
  </template>

  <template v-if="Object.keys(data).length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t($filters.humanizeError(error).icon)"
      :header="$t($filters.humanizeError(error).title)"
      :text="$t($filters.humanizeError(error).description)"
    />
  </template>
</template>

<script>
import { Placeholder, PlaceholderLoading, Separator } from '@vue-norma/ui'

import { TagCard } from '@/components/tag'
import { useTagStore } from '@/app/components/stores/modules/tag'

export default {
  name: 'tag',
  props: {
    slug: {
      type: [ Boolean, String ],
      default: false
    }
  },
  components: { TagCard, Placeholder, PlaceholderLoading, Separator },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('tag.title'),
      },
    }
  },
  setup() {
    const store = useTagStore()
    return { store }
  },
  computed: {
    data()         { return this.store.data },
    loading()      { return this.store.loading },
    error()        { return this.store.error },
    isEmpty()      { return this.store.isEmpty },
  },
  methods: { },
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
        this.meta.title = `#${to.slug}`
    },
    error(to) {
      if (to)
        this.meta.title = this.$t(this.$filters.humanizeError(this.error).title)
    }
  }
}
</script>