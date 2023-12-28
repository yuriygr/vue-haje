<template>
  <div class="entry-comments">
    <n-header>
      {{ $tc('entry.comments', entry.counters.comments) }}
    </n-header>
    <spacer height="20" />
    <div class="entry-comments__list">
      <comment-item :data="entry" />
    <spacer height="20" />
      <comment-item :data="entry" />
    <spacer height="20" />
      <comment-item :data="entry" />
    </div>
  </div>
</template>

<script>
import { Placeholder, PlaceholderLoading, Separator, NButton, Spacer, NHeader } from '@vue-norma/ui'

import { CommentItem } from '@/components/comment'

export default {
  name: 'entry-comments',
  components: {
    Placeholder, PlaceholderLoading, Separator, NButton, Spacer, NHeader,
    CommentItem
  },
  props: {
    entry: {
      type: [ Object, Boolean ],
      default: false
    }
  }
}
</script>

<style lang="scss">

</style>