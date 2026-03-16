import { ref } from 'vue'

import { debounce } from '@/app/services/utilities'

const LOCAL_KEY = 'compose_draft'

export function useDraft(vm, { mode = 'add' } = {}) {
  const { $api, $alerts, $t, $store } = vm

  const isSaving = ref(false)
  const lastSaved = ref(null)

  const isEditMode = mode === 'edit'

  // ─── localStorage ───────────────────────────────────────

  function saveLocal(form) {
    if (isEditMode) return
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify({
        ...form,
        savedAt: Date.now()
      }))
    } catch {}
  }

  function loadLocal() {
    try {
      const raw = localStorage.getItem(LOCAL_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  function clearLocal() {
    localStorage.removeItem(LOCAL_KEY)
  }

  // ─── Серверное сохранение ───────────────────────────────

  async function saveRemote(form) {
    if (isSaving.value) return
    isSaving.value = true

    const payload = {
      text: form.text,
      files: form.files.map(f => f.uuid).filter(Boolean),
      link: form.link,
      is_comments_enabled: form.is_comments_enabled,
      is_hidden_from_feed: form.is_hidden_from_feed,
      is_nsfw: form.is_nsfw,
      is_ai: form.is_ai
    }

    try {
      await $store.dispatch('drafts/save', payload)
      lastSaved.value = new Date()
    } catch (error) {
      $alerts.danger({ text: $t(`alerts.${error.status}`) })
    } finally {
      isSaving.value = false
    }
  }

  // ─── Автосохранение ─────────────────────────────────────

  const autoSave = debounce((form) => {
    if (isEditMode) return
    saveLocal(form)
    saveRemote(form)
  }, 2000)

  // ─── Загрузка черновика ─────────────────────────────────

  async function loadDraft(id) {
    try {
      return await $store.dispatch('drafts/load', id)
    } catch (error) {
      $alerts.danger({ text: $t(`alerts.${error.status}`) })
      return null
    }
  }

  // ─── Удаление одного черновика ──────────────────────────

  async function deleteDraft(id) {
    try {
      await $store.dispatch('drafts/remove', id)
    } catch (error) {
      $alerts.danger({ text: $t(`alerts.${error.status}`) })
    }
  }

  // ─── Удаление всех черновиков ───────────────────────────

  async function deleteAll() {
    clearLocal()
    try {
      await $store.dispatch('drafts/deleteAll')
      $alerts.success({ text: $t('alerts.deleted') })
    } catch (error) {
      $alerts.danger({ text: $t(`alerts.${error.status}`) })
    }
  }

  // ─── После публикации ───────────────────────────────────

  async function discardDraft() {
    clearLocal()
    autoSave.cancel()
    try {
      await $store.dispatch('drafts/discard')
    } catch {}
  }

  return {
    // Состояние
    isSaving,
    lastSaved,

    // localStorage
    saveLocal,
    loadLocal,
    clearLocal,

    // Серверные операции
    loadDraft,
    deleteDraft,
    deleteAll,
    discardDraft,

    // Автосохранение
    autoSave
  }
}