<template>
  <modal size="small">
    <modal-header :title="$t('modals.feed-report.title')">
      <template #after>
         <n-button icon_before="ui-close-circle" mode="tertiary" @click.exact="closeModal" :title="$t('action.close')" />
      </template>
    </modal-header>

    <template v-for="reason in reasons" :key="reason.key">
      <n-radio v-model="current" :value="reason.key" :label="reason.label" name="reason" />
    </template>

    <footer class="modal__footer">
      <n-button mode="secondary" @click.exact="closeModal">{{ $t('action.cancel') }}</n-button>
      <n-button :disabled="current == '' || loading" @click.exact="submit">{{ $t('action.send_report') }}</n-button>
    </footer>
  </modal>
</template>

<script>
import { Modal, ModalHeader, NButton } from '@vue-norma/ui'

export default {
  name: 'feed-report-modal',
  components: {
    Modal, ModalHeader, NButton
  },
  props: {
    reportFeed: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      current: ''
    }
  },
  computed: {
    reasons() {
      return [
        { key: 'gore', label: this.$t('report.reason.gore') },
        { key: 'harassment', label: this.$t('report.reason.harassment') },
        { key: 'hateful', label: this.$t('report.reason.hateful') },
        { key: 'self-harm', label: this.$t('report.reason.self-harm') },
        { key: 'nudity', label: this.$t('report.reason.nudity') },
        { key: 'spam', label: this.$t('report.reason.spam') },
        { key: 'screamer', label: this.$t('report.reason.screamer') },
        { key: 'terrorism', label: this.$t('report.reason.terrorism') },
      ]
    }
  },
  methods: {
    resetReason(e) {
      this.current = ''
    },
    submit() {
      this.loading = true
      
      this.reportFeed(this.current)
      .then(() => {
        this.$modals.close()
      })
      .catch()
      .finally(() => {
        this.loading = false
      })
    },
    closeModal() {
      this.$modals.close()
    }
  }
}
</script>