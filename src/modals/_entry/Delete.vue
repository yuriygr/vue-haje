<template>
  <modal size="small">
    <modal-header :title="$t('modals.entry-delete.title')">
      <template #after>
         <n-button icon_before="ui-close-circle" mode="tertiary" @click.exact="closeModal" :title="$t('action.close')" />
      </template>
    </modal-header>

    <modal-body>
      {{ $t('modals.entry-delete.help') }}
    </modal-body>

    <footer class="modal__footer">
      <n-button mode="secondary" @click.exact="closeModal">{{ $t('action.cancel') }}</n-button>
      <n-button :disabled="loading" @click.exact="submit">{{ $t('action.delete') }}</n-button>
    </footer>
  </modal>
</template>

<script>
import { Modal, ModalHeader, ModalBody, NButton } from '@vue-norma/ui'

export default {
  name: 'entry-delete-modal',
  components: {
    Modal, ModalHeader, ModalBody, NButton
  },
  props: {
    data: {
      type: Object,
      default: false
    },
    deleteEntry: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    submit() {
      this.loading = true

      this.deleteEntry()
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

<style lang="scss">

</style>