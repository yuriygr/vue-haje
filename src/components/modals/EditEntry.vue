<template>
  <modal size="small">
    <modal-header :title="$t('modals.edit-entry.title')">
      <template #after>
        <icon-button name="ui-close-circle" mode="tertiary" @click.exact="closeModal" :title="$t('action.close')" />
      </template>
    </modal-header>

    <placeholder
      :icon="$t('errors.todo.icon')"
      :header="$t('errors.todo.title')"
      :text="$t('errors.todo.description')"
    />

    <footer class="modal__footer">
      <n-button mode="secondary" @click.exact="closeModal">{{ $t('action.cancel') }}</n-button>
      <n-button :disabled="loading">{{ $t('action.save') }}</n-button>
    </footer>
  </modal>
</template>

<script>
import { Modal, ModalHeader, ModalBody, NButton, IconButton, Placeholder } from '@vue-norma/ui'

export default {
  name: 'edit-entry-modal',
  components: {
    Modal, ModalHeader, ModalBody, NButton, IconButton, Placeholder
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
    saveEntry() {
      alert("@TODO")
    },
    closeModal() {
      this.$modals.close()
    }
  }
}
</script>

<style lang="scss">

</style>