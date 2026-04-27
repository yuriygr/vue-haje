import { watch, onMounted, onActivated, getCurrentInstance } from 'vue'

let globalOptions = {
  defaultTitle: false,
  separator: '-'
}

// Вызывается один раз при install, чтобы пробросить options из app.use(meta, {...})
export function setMetaOptions(options) {
  globalOptions = { ...globalOptions, ...options }
}

function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches
}

function applyTitle(value) {
  if (!value) return
  document.title = !isPWA()
    ? `${value} ${globalOptions.separator} ${globalOptions.defaultTitle}`
    : (value || globalOptions.defaultTitle)
}

function applyMeta(key, value) {
  document.querySelector(`meta[name="${key}"]`)?.setAttribute('content', value)
}

function applyDataset(key, value) {
  if (!value) {
    delete document.documentElement.dataset[key]
  } else {
    document.documentElement.dataset[key] = value
  }
}

function applyAll(meta) {
  if (!meta) return
  if (meta.title) applyTitle(meta.title)
  if (meta.description) applyMeta('description', meta.description)
}

export function useMeta(metaFn) {
  onMounted(() => applyAll(metaFn()))
  onActivated(() => applyAll(metaFn()))
  watch(metaFn, applyAll, { deep: true })

  return {
    setTitle: (value) => applyTitle(value),
    setMeta: applyMeta,
    setDataset: applyDataset
  }
}

/*
import { setMetaOptions } from '@/composables/useMeta'

install(app, options = {}) {
  const merged = { ...this.defaultOptions, ...options }
  setMetaOptions(merged)
  app.mixin(this.createMixin(merged)) // старый миксин пока оставляем
}


import { useMeta } from '@/composables/useMeta'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t } = useI18n()
const title = ref(t('feed.tabs.timeline'))

const { setTitle } = useMeta(() => ({ title: title.value }))

// поменять из метода:
title.value = t('feed.tabs.other')
// или напрямую:
setTitle(t('feed.tabs.other'))
*/