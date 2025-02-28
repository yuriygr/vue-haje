<template>
  <modal size="small">
    <modal-header :title="$t('modals.comment-delete.title')">
      <template #after>
         <n-button icon_before="ui-close-circle" mode="tertiary" @click.exact="closeModal" :title="$t('action.close')" />
      </template>
    </modal-header>

    <modal-body>
      {{ $t('modals.comment-delete.help') }}
    </modal-body>

    <footer class="modal__footer">
      <n-button mode="secondary" @click.exact="closeModal">{{ $t('action.cancel') }}</n-button>
      <n-button :disabled="loading" @click.exact="deleteComment">{{ $t('action.delete') }}</n-button>
    </footer>
  </modal>
</template>

<script>
import { Modal, ModalHeader, ModalBody, NButton } from '@vue-norma/ui'

export default {
  name: 'comment-delete-modal',
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
    deleteComment() {
      this.loading = true

      this.$api.delete(`comment/${this.data.comment_id}`)
      .then(_ => {
        this.$alerts.success({ text: this.$t(`success.${response.status}`) })
        this.$modals.close()
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`errors.${error.status}`) })
        this.$modals.close()
      })
      .then(_ => this.loading = false)
    },
    closeModal() {
      this.$modals.close()
    }
  }
}
</script>

<style lang="scss">

</style>