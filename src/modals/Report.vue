<template>
  <modal size="small">
    <modal-header :title="$t('modals.report.title')">
      <template #after>
        <n-button icon_before="ui-close-circle" mode="tertiary" @click.exact="closeModal" :title="$t('action.close')" />
      </template>
    </modal-header>

    <modal-body>
      <form-block v-for="reason in reasons" :key="reason.key">
        <n-radio v-model="current" :value="reason.key" :label="reason.label" name="reason" />
      </form-block>
    </modal-body>

    <footer class="modal__footer">
      <n-button mode="secondary" @click.exact="closeModal">{{ $t('action.cancel') }}</n-button>
      <n-button :disabled="current == '' || loading" @click.exact="submit">{{ $t('action.send_report') }}</n-button>
    </footer>
  </modal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Modal, ModalHeader, ModalBody, NButton,
  useModals
} from '@vue-norma/ui'

const props = defineProps({
  callback: {
    type: Function,
    default: () => {}
  }
})

const { t } = useI18n()
const modals = useModals()

const loading = ref(false)
const current = ref('')

const reasons = computed(() => [
  { key: 'gore',       label: t('report.reason.gore') },
  { key: 'harassment', label: t('report.reason.harassment') },
  { key: 'hateful',    label: t('report.reason.hateful') },
  { key: 'self-harm',  label: t('report.reason.self-harm') },
  { key: 'nudity',     label: t('report.reason.nudity') },
  { key: 'spam',       label: t('report.reason.spam') },
  { key: 'screamer',   label: t('report.reason.screamer') },
  { key: 'terrorism',  label: t('report.reason.terrorism') },
])

async function submit() {
  loading.value = true
  try {
    await props.callback(current.value)
    modals.close()
  } finally {
    loading.value = false
  }
}

function closeModal() {
  modals.close()
}

defineExpose({ closeModal })
</script>