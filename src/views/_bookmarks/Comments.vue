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
    :icon="t('bookmarks.empty.icon')"
    :header="t('bookmarks.empty.title')"
    :text="t('bookmarks.empty.description')"
  />
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { Placeholder } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

import { CommentItem } from '@/components/comment'
import { useBookmarksCommentsStore } from '@/app/store/modules/bookmarks'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'

defineOptions({
  name: 'bookmarks-comments'
})

// Composables
const { t } = useI18n()
const store = useBookmarksCommentsStore()
const humanizeError = useHumanizeError()
const { data, loading, error, hasMoreItems } = storeToRefs(store)
useMeta(() => ({ title: t('bookmarks.title.comments') }))

// Methods
function loadMore() {
  store.more()
}

// Lifecycle hooks
onMounted(() => store.fetch())
onBeforeUnmount(() => store.clear())
</script>