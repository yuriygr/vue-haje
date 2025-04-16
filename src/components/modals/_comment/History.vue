<template>
  <modal size="small">
    <modal-header :title="$t('modals.comment-history.title')">
      <template #after>
        <n-button icon_before="ui-close-circle" mode="tertiary" @click.exact="closeModal" :title="$t('action.close')" />
      </template>
    </modal-header>

    <modal-body v-if="(!loading && !error) || data.length > 0">
      <template v-for="(item, index) in data" :key="`comment-${item.comment_id}-content-${item.content_id}`">
        <comment-history-item :data="item" />
        <separator v-if="data.length > index + 1" />
      </template>

      <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

      <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
    </modal-body>

    <template v-if="data.length == 0">
      <placeholder-loading v-if="loading" />
      <placeholder v-else-if="error"
        :icon="$t(humanizeError.icon)"
        :header="$t(humanizeError.title)"
        :text="$t(humanizeError.description)"
      />
      <placeholder v-else :text="$t('comment.errors.empty_comment_history')" />
    </template>

    <footer class="modal__footer">
      <n-button mode="secondary" @click.exact="closeModal">{{ $t('action.close') }}</n-button>
    </footer>
  </modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Modal, ModalHeader, ModalBody, NButton, LoadmoreTrigger, Placeholder, PlaceholderLoading, Separator } from '@vue-norma/ui'

import { CommentHistoryItem } from '@/components/comment'

export default {
  name: 'comment-history-modal',
  components: {
    Modal, ModalHeader, ModalBody,
    NButton, LoadmoreTrigger, Placeholder, PlaceholderLoading, Separator,
    CommentHistoryItem
  },
  props: {
    id: {
      type: [ Boolean, String ],
      default: false
    }
  },
  data() {
    return { }
  },
  computed: {
    ...mapState('comment/history', [ 'data', 'loading', 'error' ]),
    ...mapGetters('comment/history', [ 'hasMoreItems' ]),

    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: {
    closeModal() {
      this.$modals.close()
    },
    loadMore() {
      this.$store.dispatch('comment/history/more', this.id)
    },
  },
  mounted() {
    this.$store.dispatch('comment/history/fetch', { initial: true, id: this.id })
  },
  beforeUnmount() {
    this.$store.dispatch('comment/history/clear')
  },
}
</script>

<style lang="scss">

</style>