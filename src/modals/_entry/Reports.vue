<template>
  <modal size="small">
    <modal-header :title="$t('modals.entry-reports.title')">
      <template #after>
        <n-button icon_before="ui-close-circle" mode="tertiary" @click.exact="closeModal" :title="$t('action.close')" />
      </template>
    </modal-header>

    <modal-body v-if="(!loading && !error) || data.length > 0">
      {{ data }}

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
      <placeholder v-else :text="$t('entry.errors.empty_entry_reports')" />
    </template>

    <footer class="modal__footer">
      <n-button mode="secondary" @click.exact="closeModal">{{ $t('action.close') }}</n-button>
    </footer>
  </modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Modal, ModalHeader, ModalBody, NButton, LoadmoreTrigger, Placeholder, PlaceholderLoading, Separator } from '@vue-norma/ui'

export default {
  name: 'entry-reports-modal',
  components: {
    Modal, ModalHeader, ModalBody,
    NButton, LoadmoreTrigger, Placeholder, PlaceholderLoading, Separator
  },
  props: {
    uuid: {
      type: [ Boolean, String ],
      default: false
    }
  },
  data() {
    return { }
  },
  computed: {
    ...mapState('entry/reports', [ 'data', 'loading', 'error' ]),
    ...mapGetters('entry/reports', [ 'hasMoreItems' ]),

    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: {
    closeModal() {
      this.$modals.close()
    },
    loadMore() {
      this.$store.dispatch('entry/reports/more', this.uuid)
    },
  },
  mounted() {
    this.$store.dispatch('entry/reports/fetch', { initial: true, uuid: this.uuid })
  },
  beforeUnmount() {
    this.$store.dispatch('entry/reports/clear')
  }
}
</script>