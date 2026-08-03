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
    :icon="$t('bookmarks.empty.icon')"
    :header="$t('bookmarks.empty.title')"
    :text="$t('bookmarks.empty.description')"
  />
</template>

<script>
import { Placeholder, NButton, LoadmoreTrigger } from '@vue-norma/ui'

import { CommentItem } from '@/components/comment'
import { useBookmarksCommentsStore } from '@/app/store/modules/bookmarks'
import { useHumanizeError } from '@/app/composables/useHumanizeError'

export default {
  name: 'bookmarks-comments',
  components: {
    CommentItem,
    Placeholder, NButton, LoadmoreTrigger
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('bookmarks.title.comments')
      }
    }
  },
  setup() {
    const store = useBookmarksCommentsStore()
    const humanizeError = useHumanizeError()
    return { store, humanizeError }
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
      this.store.more()
    }
  },
  mounted() {
    this.store.fetch()
  },
  beforeUnmount() {
    this.store.clear()
  }
}
</script>