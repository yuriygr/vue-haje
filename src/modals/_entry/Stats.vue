<template>
  <modal size="small">
    <modal-header :title="$t('modals.entry-stats.title')">
      <template #after>
         <n-button icon_before="ui-close-circle" mode="tertiary" @click.exact="closeModal" :title="$t('action.close')" />
      </template>
    </modal-header>

    <placeholder
      :icon="$t('errors.todo.icon')"
      :header="$t('errors.todo.title')"
      :text="$t('errors.todo.description')"
    />

    <footer class="modal__footer">
      <n-button  mode="secondary" @click.exact="closeModal" :stretched="true">{{ $t('action.close') }}</n-button>
    </footer>
  </modal>
</template>

<script>
import { Modal, ModalHeader, ModalBody, NButton, Placeholder } from '@vue-norma/ui'
import { useModals } from '@vue-norma/ui'

export default {
  name: 'entry-stats-modal',
  components: {
    Modal, ModalHeader, ModalBody, NButton, Placeholder
  },
  props: {
    data: {
      type: Object,
      default: false
    }
  },
  setup() {
    const modals = useModals()
    return { modals }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    deleteEntry() {
      alert("@TODO")
    },
    closeModal() {
      this.modals.close()
    }
  }
}
</script>