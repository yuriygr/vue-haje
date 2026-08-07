<template>
  <items-list type="comments" v-if="data.length > 0 || loading" :has-data="data.length > 0" :loading="loading" :has-more="hasMoreItems" @more="loadMore">
    <comment-item v-for="item in data" :key="`comment-${item.comment_id}`" v-memo="[item.comment_id]" :data="item" replyButton="link" />

    <template #skeleton>
      <comment-item v-for="index in 15" :key="`item-${index}`" />
    </template>
  </items-list>

  <placeholder v-else-if="error"
    :icon="humanizeError(error).icon"
    :header="humanizeError(error).title"
    :text="humanizeError(error).description"
  />
  <placeholder v-else
    :icon="t('search.empty.icon')"
    :header="t('search.empty.title')"
    :text="t('search.empty.description')"
  />
</template>

<script>
import { Placeholder, NButton, LoadmoreTrigger } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'

import { CommentItem } from '@/components/comment'
import { useSearchCommentsStore } from '@/app/store/modules/search'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'

export default {
  name: 'search-comments',
  components: {
    CommentItem,
    Placeholder, NButton, LoadmoreTrigger
  },
  setup() {
    const { t } = useI18n()
    const store = useSearchCommentsStore()
    const humanizeError = useHumanizeError()

    useMeta(() => ({ title: t('search.title.comments') }))

    return { t, store, humanizeError }
  },
  computed: {
    data()         { return this.store.data },
    filters()      { return this.store.filters },
    loading()      { return this.store.loading },
    error()        { return this.store.error },
    hasMoreItems() { return this.store.hasMoreItems },

    // TODO: Понять зачем это 
    emptyQuery() {
      return this.store.filters.query === ''
    },
    searching() {
      return this.store.filters.query != ''
    }
  },
  methods: {
    loadMore() {
      this.store.more()
    }
  },
  mounted() {
    this.store.setFilters({
      query: this.$route.query.q, offset: undefined
    })
    this.store.fetch()
  },
  beforeUnmount() {
    this.store.clear()
  },
  watch: {
    '$route.query.q'(to) {
      this.store.setFilters({
        query: to, offset: undefined
      })
      this.store.fetch()
    }
  }
}
</script>