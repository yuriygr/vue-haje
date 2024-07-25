<template>
  <modal size="small">
    <modal-header :title="$t('modals.delete-entry.title')">
      <template #after>
         <n-button icon_before="ui-close-circle" mode="tertiary" @click.exact="closeModal" :title="$t('action.close')" />
      </template>
    </modal-header>

    <modal-body>
      {{ $t('modals.delete-entry.help') }}
    </modal-body>

    <footer class="modal__footer">
      <n-button mode="secondary" @click.exact="closeModal">{{ $t('action.cancel') }}</n-button>
      <n-button :disabled="loading" @click.exact="deleteEntry">{{ $t('action.delete') }}</n-button>
    </footer>
  </modal>
</template>

<script>
import { Modal, ModalHeader, ModalBody, NButton } from '@vue-norma/ui'

export default {
  name: 'delete-entry-modal',
  components: {
    Modal, ModalHeader, ModalBody, NButton
  },
  props: {
    data: {
      type: Object,
      default: false
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    deleteEntry() {
      this.loading = true
      this.$api.delete(`entry/${this.data.uuid}`)
      .then(_ => {
        this.$alerts.success({ text: 'Запись успешно удалена' })
        this.$modals.close()
      })
      .catch(error => {
        this.$alerts.danger({ text: error.message })
      })
      .then(_ => {
        this.loading = false
      })
    },
    closeModal() {
      this.$modals.close()
    }
  }
}
</script>

<style lang="scss">

</style>