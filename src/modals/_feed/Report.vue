<template>
  <modal size="small">
    <modal-header :title="$t('modals.feed-report.title')">
      <template #after>
         <n-button icon_before="ui-close-circle" mode="tertiary" @click.exact="closeModal" :title="$t('action.close')" />
      </template>
    </modal-header>

    <modal-checklist
      :title="$t('report.why')"
      :items="reasons"
      :current="current"
      
      @change="changeReason"
      @reset="resetReason"
    />

    <footer class="modal__footer">
      <n-button mode="secondary" @click.exact="closeModal">{{ $t('action.cancel') }}</n-button>
      <n-button :disabled="current == 0" @click.exact="submit">{{ $t('action.send_report') }}</n-button>
    </footer>
  </modal>
</template>

<script>
import { Modal, ModalHeader, ModalChecklist, NButton } from '@vue-norma/ui'

export default {
  name: 'feed-report-modal',
  components: {
    Modal, ModalHeader, ModalChecklist, NButton
  },
  props: {
    reportFeed: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      reasons: [
        { id: 1, label: this.$t('report.reason.gore') },
        { id: 2, label: this.$t('report.reason.harassment') },
        { id: 3, label: this.$t('report.reason.hateful') },
        { id: 4, label: this.$t('report.reason.self-harm') },
        { id: 5, label: this.$t('report.reason.nudity') },
        { id: 6, label: this.$t('report.reason.spam') },
        { id: 7, label: this.$t('report.reason.screamer') },
        { id: 8, label: this.$t('report.reason.terrorism') },
      ],
      current: 0
    }
  },
  methods: {
    changeReason(e, id) {
      this.current = id
    },
    resetReason(e) {
      this.current = 0
    },
    submit() {
      this.loading = true
      
      this.reportFeed(this.current)
      .then(_ => {
        this.loading = false
        this.$modals.close()
      })
    },
    closeModal() {
      this.$modals.close()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>